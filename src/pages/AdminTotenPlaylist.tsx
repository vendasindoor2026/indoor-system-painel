import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminTotenPlaylist() {
  const { id } = useParams(); // ID do toten
  const [toten, setToten] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);

    // pega toten + playlist atual + cliente
    const { data: t } = await supabase
      .from("totens")
      .select(`
        id,
        name,
        playlist_id,
        client_id,
        playlists(name),
        clients(company_name)
      `)
      .eq("id", id)
      .single();

    setToten(t);

    if (t?.client_id) {
      // pega playlists do cliente do toten
      const { data: pls } = await supabase
        .from("playlists")
        .select("id, name")
        .eq("client_id", t.client_id)
        .order("created_at", { ascending: true });

      setPlaylists(pls || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function changePlaylist(pid) {
    setSaving(true);

    const { error } = await supabase
      .from("totens")
      .update({ playlist_id: pid })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Erro ao aplicar playlist: " + error.message);
      return;
    }

    alert("Playlist aplicada com sucesso!");
    load();
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Trocar Playlist (Admin)</h1>

      {loading && <p>Carregando dados…</p>}

      {!loading && toten && (
        <div className="bg-white border shadow rounded-xl p-6 max-w-2xl">

          {/* Info do toten */}
          <h2 className="text-xl font-semibold mb-3">
            {toten.name}
          </h2>

          <p className="text-gray-700 mb-1">
            <strong>Cliente:</strong> {toten.clients?.company_name}
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Playlist atual:</strong>{" "}
            {toten.playlists?.name || "Nenhuma aplicada"}
          </p>

          {/* Lista de playlists */}
          <h3 className="text-lg font-semibold mb-3">
            Selecionar nova playlist:
          </h3>

          <div className="space-y-3">
            {playlists.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border p-3 rounded hover:bg-gray-50"
              >
                <span className="font-medium">{p.name}</span>

                <button
                  className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 disabled:opacity-50"
                  disabled={saving}
                  onClick={() => changePlaylist(p.id)}
                >
                  Aplicar
                </button>
              </div>
            ))}
          </div>

          {playlists.length === 0 && (
            <p className="text-gray-500 mt-4">
              Esse cliente ainda não possui playlists.
            </p>
          )}

          <button
            className="mt-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => (window.location.href = `/admin/totens/${id}`)}
          >
            Voltar
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
