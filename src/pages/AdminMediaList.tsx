import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminMediaList() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("assets")
      .select(`
        id,
        filename,
        mime,
        size,
        storage_path,
        uploaded_at,
        client_id,
        clients ( company_name )
      `)
      .order("uploaded_at", { ascending: false });

    if (error) console.log(error);

    setMedia(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function isImage(mime) {
    return mime.startsWith("image/");
  }

  function isVideo(mime) {
    return mime.startsWith("video/");
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Biblioteca de Mídias</h1>

      <button
        onClick={() => (window.location.href = "/admin/media/upload")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Upload de Mídia
      </button>

      <div className="bg-white p-6 rounded-xl shadow border">
        {loading && <p>Carregando...</p>}

        {!loading && media.length === 0 && (
          <p className="text-gray-500">Nenhuma mídia enviada.</p>
        )}

        {!loading && media.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {media.map((m) => (
              <div
                key={m.id}
                className="border rounded-xl p-4 shadow hover:shadow-xl transition bg-gray-50"
              >
                <p className="font-semibold">{m.filename}</p>

                <p className="text-gray-600 text-sm">
                  <strong>Cliente:</strong> {m.clients?.company_name || "—"}
                </p>

                <p className="text-gray-600 text-sm">
                  <strong>Tipo:</strong> {m.mime}
                </p>

                <p className="text-gray-600 text-sm">
                  <strong>Tamanho:</strong>{" "}
                  {(m.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="text-gray-600 text-sm">
                  <strong>Upload:</strong>{" "}
                  {new Date(m.uploaded_at).toLocaleString()}
                </p>

                <div className="mt-4">
                  {isImage(m.mime) && (
                    <img
                      src={m.storage_path}
                      className="rounded border max-h-40"
                    />
                  )}

                  {isVideo(m.mime) && (
                    <video
                      src={m.storage_path}
                      controls
                      className="rounded border max-h-40"
                    />
                  )}
                </div>

                <button
                  onClick={() => (window.location.href = `/admin/media/${m.id}`)}
                  className="mt-4 w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
                >
                  Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
