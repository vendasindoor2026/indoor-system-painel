import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminClientMedia() {
  const { id } = useParams(); // id do cliente

  const [client, setClient] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // Carrega nome do cliente
    const { data: clientInfo } = await supabase
      .from("clients")
      .select("id, company_name")
      .eq("id", id)
      .single();

    setClient(clientInfo);

    // Carrega mídias do cliente
    const { data: mediaData } = await supabase
      .from("assets")
      .select("id, filename, mime, size, storage_path, uploaded_at")
      .eq("client_id", id)
      .order("uploaded_at", { ascending: false });

    setMedia(mediaData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  function isImage(mime: string) {
    return mime.startsWith("image/");
  }

  function isVideo(mime: string) {
    return mime.startsWith("video/");
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Mídias do Cliente — {client?.company_name}
      </h1>

      {loading && <p>Carregando...</p>}

      {!loading && media.length === 0 && (
        <p className="text-gray-500">Nenhuma mídia encontrada.</p>
      )}

      {!loading && media.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {media.map((m) => (
            <div
              key={m.id}
              className="bg-white p-4 rounded-xl shadow border flex flex-col"
            >
              <p className="font-semibold">{m.filename}</p>

              <p className="text-sm text-gray-600">
                <strong>Tamanho:</strong>{" "}
                {(m.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p className="text-sm text-gray-600">
                <strong>Tipo:</strong> {m.mime}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Upload:</strong>{" "}
                {new Date(m.uploaded_at).toLocaleString()}
              </p>

              {/* Pré-visualização */}
              <div className="mt-4">
                {isImage(m.mime) && (
                  <img
                    src={m.storage_path}
                    alt="preview"
                    className="rounded-lg border"
                  />
                )}

                {isVideo(m.mime) && (
                  <video
                    src={m.storage_path}
                    className="rounded-lg border w-full"
                    controls
                  />
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    (window.location.href = `/admin/media/${m.id}`)
                  }
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Detalhes
                </button>

                <button
                  onClick={() => alert("Função de deletar aqui futuramente")}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
