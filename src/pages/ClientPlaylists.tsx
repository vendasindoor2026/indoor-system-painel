import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  async function loadPlaylists() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    // pegar client_id
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!client) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });

    if (!error) setPlaylists(data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  // ----- CRIAR PLAYLIST -----
  async function createPlaylist() {
    if (newPlaylistName.trim().length < 3) {
      alert("Nome muito curto.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!client) return;

    const { error } = await supabase.from("playlists").insert([
      {
        name: newPlaylistName,
        client_id: client.id,
      },
    ]);

    if (error) {
      alert("Erro ao criar playlist: " + error.message);
      return;
    }

    setShowCreate(false);
    setNewPlaylistName("");
    loadPlaylists();
  }

  // ----- EXCLUIR PLAYLIST -----
  async function deletePlaylist(id) {
    if (!confirm("Excluir esta playlist? Isso removerá os itens também.")) return;

    await supabase.from("playlist_items").delete().eq("playlist_id", id);
    await supabase.from("playlists").delete().eq("id", id);

    loadPlaylists();
  }

  return (
    <ClientLayout>
      <div className="p-2">
        <h1 className="text-2xl font-bold mb-4">Minhas Playlists</h1>

        {/* Botão Criar */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={() => setShowCreate(true)}
        >
          + Criar Playlist
        </button>

        {loading && <p className="mt-4 text-gray-500">Carregando playlists…</p>}

        {/* Lista */}
        {!loading && playlists.length === 0 && (
          <p className="mt-4 text-gray-500">Nenhuma playlist criada ainda.</p>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((p) => (
            <div key={p.id} className="bg-white p-5 shadow rounded-lg border">
              <h2 className="text-lg font-semibold">{p.name}</h2>

              <p className="text-sm text-gray-600 mt-2">
                Criada em: {new Date(p.created_at).toLocaleString()}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  onClick={() =>
                    (window.location.href = `/client/playlists/${p.id}`)
                  }
                >
                  Abrir
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => deletePlaylist(p.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL DE CRIAÇÃO */}
