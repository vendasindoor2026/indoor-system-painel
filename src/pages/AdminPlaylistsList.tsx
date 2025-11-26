import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminPlaylistsList() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // pegar playlists + cliente
    const { data: playlistsData, error } = await supabase
      .from("playlists")
      .select(`
        id,
        name,
        created_at,
        client_id,
        clients ( company_name )
      `)
      .order("created_at", { ascending: false });

    if (error) console.log(error);

    // pegar número de itens
    for (let p of playlistsData || []) {
      const { count } = await supabase
        .from("playlist_items")
        .select("*", { count: "exact", head: true })
        .eq("playlist_id", p.id);

      p.itemCount = count || 0;
    }

    setPlaylists(playlistsData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Playlists</h1>

      <button
        onClick={() => (window.location.href = "/admin/playlists/new")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Nova Playlist
      </button>

      <div className="bg-white p-6 rounded-xl shadow border">
        {loading && <p>Carregando...</p>}

        {!loading && playlists.length === 0 && (
          <p className="text-gray-500">Nenhuma playlist cadastrada.</p>
        )}

        {!loading && playlists.length > 0 && (
          <div className="space-y-4">
            {playlists.map((p) => (
              <div
                key={p.id}
                className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="text-xl font-semibold">{p.name}</p>
                  <p className="text-gray-600">
                    <strong>Cliente:</strong> {p.clients?.company_name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Itens:</strong> {p.itemCount}
                  </p>
                  <p className="text-gray-600">
                    <strong>Criado:</strong>{" "}
                    {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/playlists/${p.id}`)
                    }
                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Detalhes
                  </button>

                  <button
                    onClick={() =>
                      (window.location.href = `/admin/playlists/${p.id}/edit`)
                    }
                    className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      (window.location.href = `/admin/playlists/${p.id}/preview`)
                    }
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
