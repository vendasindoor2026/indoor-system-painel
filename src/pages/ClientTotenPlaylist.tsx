import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientTotenPlaylist() {
  const { id } = useParams(); // id do toten
  const [toten, setToten] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega toten + playlist atual + playlists disponíveis
  async function load() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    // pega o client_id
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    // pega o toten
    const { data: t } = await supabase
      .from("totens")
      .select("id, name, playlist_id, playlists(name)")
      .eq("id", id)
      .eq("client_id", client.id)
      .single();

    setToten(t);

    // pega playlists do cliente
    const { data: pls } = await supabase
      .from("playlists")
      .select("id, name")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });

    setPlaylists(pls || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  // Trocar playlist do toten
  async function changePlaylist(newPlaylist) {
    setSaving(true);

    const { error } = await supabase
      .from("totens")
      .update({ playlist_id: newPlaylist })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Erro ao trocar playlist: " + error.message);
      return;
    }

    alert("Playlist alterada com sucesso!");
    load();
  }

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-6">Trocar Playlist</h1>

      {loading && <p>Carregando…</p>}

      {!loading && toten && (
        <div className="bg-white border shadow rounded-lg p-6 max-w-2xl">

          <h2 className="text-xl font-semibold mb-2">
            {toten.name}
          </h2>

          <p className="text-gray-700 mb-4">
            <strong>Playlist atual:</strong>{" "}
            {toten.playlists?.name || "Nenhuma playlist aplicada"}
          </p>

          <h3 className="text-lg font-semibold mb-3">
            Selecionar nova playlist:
          </h3>

          <div className="space-y-3">
            {playlists.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50"
              >
                <span className="font-medium">{p.name}</span>

                <button
                  disabled={saving}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => changePlaylist(p.id)}
                >
                  Aplicar
                </button>
              </div>
            ))}
          </div>

          {playlists.length === 0 && (
            <p className="text-gray-500 mt-4">
              Nenhuma playlist criada ainda.
            </p>
          )}

          <button
            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => (window.location.href = `/client/totens/${id}`)}
          >
            Voltar
          </button>
        </div>
      )}
    </ClientLayout>
  );
}
