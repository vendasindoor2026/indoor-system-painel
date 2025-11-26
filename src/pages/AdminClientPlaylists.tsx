import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminClientPlaylists() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [playlists, setPlaylists] = useState([]);
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

    // Carrega playlists do cliente
    const { data: playlistsData } = await supabase
      .from("playlists")
      .select("id, name, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false });

    // Carrega a quantidade de itens em cada playlist
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
  }, [id]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Playlists do Cliente — {client?.company_name}
      </h1>

      {/* botão criar */}
      <button
        onClick={() =>
          (window.location.href = `/admin/playlists/new?client=${id}`)
        }
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Nova Playlist
      </button>

      {loading && <p>Carregando...</p>}

      {!loading && playlists.length === 0 && (
        <p className="text-gray-500">Nenhuma playlist encontrada.</p>
      )}

      {!loading && playlists.length > 0 && (
        <div className="space-y-4">
          {playlists.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-xl shadow border flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="text-xl font-semibold">{p.name}</p>

                <p className="text-gray-600">
                  <strong>Itens:</strong> {p.itemCount}
                </p>

                <p className="text-gray-600">
                  <strong>Criado em:</strong>{" "}
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
    </AdminLayout>
  );
}
