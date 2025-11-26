import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminPlaylistDetails() {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // carregar playlist + cliente
    const { data: playlistData } = await supabase
      .from("playlists")
      .select(`
        id,
        name,
        created_at,
        clients ( company_name )
      `)
      .eq("id", id)
      .single();

    setPlaylist(playlistData);

    // carregar itens da playlist
    const { data: itemsData } = await supabase
      .from("playlist_items")
      .select(`
        id,
        order_index,
        duration_seconds,
        assets (
          id,
          filename,
          mime,
          storage_path
        )
      `)
      .eq("playlist_id", id)
      .order("order_index", { ascending: true });

    setItems(itemsData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Playlist: {playlist?.name}
      </h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {/* Painel da playlist */}
          <div className="bg-white p-6 rounded-xl shadow border max-w-2xl mb-8">
            <p className="text-lg">
              <strong>Cliente:</strong> {playlist?.clients?.company_name}
            </p>

            <p className="text-lg">
              <strong>Itens:</strong> {items.length}
            </p>

            <p className="text-gray-600">
              <strong>Criado em:</strong>{" "}
              {new Date(playlist.created_at).toLocaleString()}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => (window.location.href = `/admin/playlists/${id}/edit`)}
              >
                Editar Nome
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => (window.location.href = `/admin/playlists/${id}/add-media`)}
              >
                Adicionar Mídias
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => (window.location.href = `/admin/playlists/${id}/order`)}
              >
                Ordenar Itens
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => (window.location.href = `/admin/playlists/${id}/preview`)}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Itens da playlist */}
          <h2 className="text-2xl font-bold mb-4">Itens da Playlist</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">Nenhum item na playlist.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const asset = item.assets;

                const isImage = asset.mime.startsWith("image/");
                const isVideo = asset.mime.startsWith("video/");

                return (
                  <div
                    key={item.id}
                    className="bg-white border p-4 rounded-lg shadow flex gap-4 items-center"
                  >
                    <div className="w-32">
                      {isImage && (
                        <img
                          src={asset.storage_path}
                          className="rounded border"
                        />
                      )}

                      {isVideo && (
                        <video
                          src={asset.storage_path}
                          className="rounded border"
                          controls
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">{asset.filename}</p>
                      <p className="text-gray-600">
                        <strong>Duração:</strong> {item.duration_seconds}s
                      </p>
                      <p className="text-gray-600">
                        <strong>Ordem:</strong> {item.order_index}
                      </p>
                      <p className="text-gray-600">
                        <strong>Tipo:</strong> {asset.mime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
