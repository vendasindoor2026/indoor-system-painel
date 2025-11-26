import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminMediaUpload() {
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadClients() {
      const { data } = await supabase
        .from("clients")
        .select("id, company_name")
        .order("company_name");
      setClients(data || []);
    }
    loadClients();
  }, []);

  async function handleUpload() {
    if (!file) return alert("Selecione um arquivo");
    if (!clientId) return alert("Selecione um cliente");

    setUploading(true);

    try {
      // 1) pedir signed info ao backend
      const filename = file.name;
      const mime = file.type || "application/octet-stream";

      const resp = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, mime, client_id: clientId }),
      });
      const sign = await resp.json();
      if (!resp.ok) throw new Error(sign.error || "Erro ao assinar upload");

      // sign: { uploadUrl, uploadAuthToken, storagePath, bucketFileUrl (opcional) }
      const { uploadUrl, uploadAuthToken, storagePath } = sign;

      // 2) Upload direto ao Backblaze (PUT)
      // Backblaze exige header X-Bz-File-Name (URI encoded), Authorization = uploadAuthToken
      const putResp = await fetch(uploadUrl, {
        method: "POST", // B2 upload uses POST to the uploadUrl returned by get_upload_url
        headers: {
          Authorization: uploadAuthToken,
          "X-Bz-File-Name": encodeURIComponent(storagePath),
          "Content-Type": mime,
          "X-Bz-Content-Sha1": "do_not_verify",
        },
        body: file,
      });

      if (!putResp.ok) {
        const text = await putResp.text();
        throw new Error("Upload falhou: " + text);
      }

      // 3) Salvar metadados no Supabase (assets)
      const size = file.size;
      const { error } = await supabase.from("assets").insert({
        client_id: clientId,
        filename,
        mime,
        size,
        storage_path: storagePath,
        uploaded_at: new Date(),
      });

      if (error) throw error;

      alert("Upload concluído com sucesso!");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      alert("Erro: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Upload de Mídia</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-xl">
        <label className="block font-semibold">Cliente</label>
        <select
          className="w-full border p-2 rounded mt-1"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">Selecione um cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.company_name}
            </option>
          ))}
        </select>

        <label className="block font-semibold mt-4">Arquivo</label>
        <input
          type="file"
          className="w-full mt-2"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {uploading ? "Enviando..." : "Enviar para Backblaze"}
          </button>

          <button
            onClick={() => (window.location.href = "/admin/media")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Voltar
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
