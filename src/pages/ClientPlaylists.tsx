// src/pages/ClientPlaylists.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientPlaylists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // modal / criação
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadPlaylists() {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setPlaylists([]);
        setLoading(false);
        return;
      }

      // buscar client do usuário
      const { data: clientRow } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!clientRow?.id) {
        setPlaylists([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("playlists")
        .select("*")
        .eq("client_id", clientRow.id)
        .order("created_at", { ascending: false });

      setPlaylists(data || []);
    } catch (err) {
      console.error("loadPlaylists error", err);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function createPlaylist() {
    if (!newName.trim()) return alert("Informe um nome para a playlist.");
    setCreating(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error("Usuário não autenticado.");

      const { data: clientRow } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!clientRow?.id) throw new Error("Cliente não encontrado.");

      const { error } = await supabase.from("playlists").insert([
        {
          client_id: clientRow.id,
          name: newName.trim(),
        },
      ]);

      if (error) throw error;

      setNewName("");
      setShowCreate(false);
      await loadPlaylists();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao criar playlist: " + (err.message || String(err)));
    } finally {
      setCreating(false);
    }
  }

  async function deletePlaylist(id: string) {
    if (!confirm("Excluir playlist?")) return;
    try {
      await supabase.from("playlists").delete().eq("id", id);
      await loadPlaylists();
    } catch (err) {
      alert("Erro ao excluir: " + (err as any).message);
    }
  }

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Suas Playlists</h1>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => setShowCreate(true)}
            >
              + Nova Playlist
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => window.location.href = "/client/media"}
            >
              Biblioteca de Mídia
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-600">Carregando playlists…</p>}

        {!loading && playlists.length === 0 && (
          <p className="text-gray-500">Nenhuma playlist criada ainda.</p>
        )}

        {!loading && playlists.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((p) => (
              <div key={p.id} className="bg-white p-5 shadow rounded-lg border">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Criada: {p.created_at ? new Date(p.created_at).toLocaleString() : "—"}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    onClick={() => (window.location.href = `/client/playlists/${p.id}`)}
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
        )}

        {/* MODAL CRIAR PLAYLIST */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-3">Nova Playlist</h3>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome da playlist"
                className="w-full border p-3 rounded mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowCreate(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={createPlaylist}
                  disabled={creating}
                >
                  {creating ? "Criando..." : "Criar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
