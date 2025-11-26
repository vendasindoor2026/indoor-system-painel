import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminMediaDetails() {
  const { id } = useParams(); // id da mídia

  const [media, setMedia] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // carregar mídia + cliente
    const { data: mediaData } = await supabase
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
      .eq("id", id)
      .single();

    setMedia(mediaData);

    // carregar playlists que usam esta mídia
    const { data: playlistData } = await supabase
      .from("playlist_items")
      .select(`
        id,
        playlist_id,
        playlists ( id, name )
      `)
      .eq("asset_id", id);

    setPlaylists(playlistData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  function isImage(mime) {
    return mime.startsWith("image/");
  }

  function isVideo(mime) {
    return mime.startsWith("video/");
  }

  async function deleteMedia() {
    if (!confirm("Tem certeza que deseja deletar esta mídia?")) return;

    // impedir delete se a mídia está em playlists
    if (playlists.length > 0) {
      alert("Não é possível deletar: a mídia está sendo usada em playlists.");
      return;
    }

    const { error } = await supabase
      .from("assets")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao deletar: " + error.message);
      return;
    }

    alert("Mídia removida com sucesso!");
    window.location.href = "/admin/media";
  }

  if (loading) {
    return (
      <AdminLayout>
        <p>Carregando...</p>
      </AdminLayout>
    );
  }

  if (!media) {
    return (
      <AdminLayout>
        <p className="text-red-600">Mídia não encontrada.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Detalhes da Mídia</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-2xl">

        <p className="text-xl font-semibold">{media.filename}</p>

        <p className="text-gray-700 mt-1">
          <strong>Cliente:</strong>{" "}
          {media.clients?.company_name || "—"}
        </p>

        <p className="text-gray-700">
          <strong>Tipo:</strong> {media.mime}
        </p>

        <p className="text-gray-700">
          <strong>Tamanho:</strong>{" "}
          {(media.size / 1024 / 1024).toFixed(2)} MB
        </p>

        <p className="text-gray-700">
          <strong>Upload:</strong>{" "}
          {new Date(media.uploaded_at).toLocaleString()}
        </p>

        {/* Preview */}
        <div className="mt-6">
          {isImage(media.mime) && (
            <img
              src={media.storage_path}
              className="rounded-lg border max-h-[400px]"
            />
          )}

          {isVideo(media.mime) && (
            <video
              src={media.storage_path}
              controls
              className="rounded-lg border max-h-[400px]"
            />
          )}
        </div>

        {/* Playlists em que aparece */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">
            Utilizado em Playlists
          </h2>

          {playlists.length === 0 && (
            <p className="text-gray-500">
              Nenhuma playlist utiliza esta mídia.
            </p>
          )}

          {playlists.length > 0 && (
            <ul className="list-disc ml-6 text-gray-700">
              {playlists.map((p) => (
                <li key={p.id}>
                  <a
                    href={`/admin/playlists/${p.playlists.id}`}
                    className="text-indigo-600 underline"
                  >
                    {p.playlists.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={deleteMedia}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Excluir
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
