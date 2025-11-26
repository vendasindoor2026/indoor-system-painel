import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");

  const [file, setFile] = useState(null);

  // ---------------------------
  // CARREGAR MÍDIAS DO CLIENTE
  // ---------------------------
  async function loadMedia() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data } = await supabase
      .from("assets")
      .select("*")
      .eq("client_id", client.id)
      .order("uploaded_at", { ascending: false });

    setMediaList(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  // ---------------------------
  // UPLOAD DO ARQUIVO
  // ---------------------------
  async function handleUpload() {
    if (!file) {
      alert("Selecione um arquivo.");
      return;
    }

    setUploading(true);

    // 1) Pega o client_id
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    // 2) Pede URL assinada para o servidor
    const signResp = await fetch("/api/client-upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    const signed = await signResp.json();

    if (!signed.uploadUrl) {
      alert("Erro ao gerar URL de upload.");
      setUploading(false);
      return;
    }

    // 3) Envia o arquivo direto para o Backblaze
    const uploadResp = await fetch(signed.uploadUrl, {
      method: "POST",
      headers: {
        Authorization: signed.uploadAuthToken,
        "X-Bz-File-Name": file.name,
        "Content-Type": file.type,
        "X-Bz-Content-Sha1": "do_not_verify", // mais rápido
      },
      body: file,
    });

    const uploadJson = await uploadResp.json();

    if (!uploadJson.fileId) {
      alert("Erro no upload para o Backblaze.");
      setUploading(false);
      return;
    }

    // 4) Salva no Supabase
    await fetch("/api/client-upload/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: client.id,
        filename: file.name,
        mime: file.type,
        size: file.size,
        storage_path: `${uploadJson.fileName}`, // caminho no B2
      }),
    });

    setFile(null);
    setUploading(false);
    loadMedia();
  }

  // ---------------------------
  // EXCLUIR MÍDIA DO SUPABASE
  // ---------------------------
  async function deleteMedia(id) {
    if (!confirm("Deseja excluir essa mídia?")) return;

    await supabase.from("assets").delete().eq("id", id);
    loadMedia();
  }

  // ---------------------------
  // FILTRAR LISTA
  // ---------------------------
  const filteredMedia = mediaList.filter((m) => {
    if (filter === "image") return m.mime.startsWith("image/");
    if (filter === "video") return m.mime.startsWith("video/");
    return true;
  });

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-6">Minhas Mídias</h1>

      {/* Upload */}
      <div className="mb-6 bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold mb-3">Enviar nova mídia</h2>

        <input
          type="file"
          className="border p-2 rounded w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Enviando…" : "Enviar"}
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex gap-3">
        <button
          className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          Todos
        </button>

        <button
          className={`px-3 py-1 rounded ${filter === "image" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("image")}
        >
          Imagens
        </button>

        <button
          className={`px-3 py-1 rounded ${filter === "video" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("video")}
        >
          Vídeos
        </button>
      </div>

      {/* Lista de mídias */}
      {loading && <p className="text-gray-500">Carregando mídia…</p>}

      {!loading && filteredMedia.length === 0 && (
        <p className="text-gray-500">Nenhuma mídia encontrada.</p>
      )}

      {!loading && filteredMedia.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((m) => (
            <div key={m.id} className="bg-white shadow border rounded p-3">

              {/* Preview imagem ou vídeo */}
              {m.mime.startsWith("image/") ? (
                <img
                  src={`https://f000.backblazeb2.com/file/${process.env.VITE_B2_BUCKET_NAME}/${m.storage_path}`}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <video
                  className="w-full h-32 rounded"
                  src={`https://f000.backblazeb2.com/file/${process.env.VITE_B2_BUCKET_NAME}/${m.storage_path}`}
                />
              )}

              <p className="mt-2 font-medium">{m.filename}</p>

              <button
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => deleteMedia(m.id)}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
