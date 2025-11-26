import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";

export default function ClientPlaylistEditor() {
  const { id } = useParams(); // ID da playlist
  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [duration, setDuration] = useState(10);

  async function loadData() {
    setLoading(true);

    // pegar playlist
    const { data: playlistData } = await supabase
      .from("playlists")
      .select("*")
      .eq("id", id)
      .single();

    setPlaylist(playlistData);

    // itens da playlist
    const { data: itemsData } = await supabase
      .from("playlist_items")
      .select("*, assets(filename)")
      .eq("playlist_id", id)
      .order("order_index");

    setItems(itemsData || []);

    // mídias disponíveis do cliente
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data: assetsData } = await supabase
      .from("assets")
      .select("*")
      .eq("client_id", client.id)
      .order("uploaded_at", { ascending: false });

    setMedia(assetsData || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  // ----- ADICIONAR ITEM -----
  async function addItem() {
    if (!selectedAsset) return alert("Selecione uma mídia.");

    const newIndex = items.length;

    const { error } = await supabase.from("playlist_items").insert([
      {
        playlist_id: id,
        asset_id: selectedAsset,
        order_index: newIndex,
        duration_seconds: duration,
      },
    ]);

    if (error) {
      alert("Erro ao adicionar item: " + error.message);
      return;
    }

    setAdding(false);
    setSelectedAsset("");
    setDuration(10);

    loadData();
  }

  // ----- REMOVER ITEM -----
  async function removeItem(itemId) {
    if (!confirm("Remover item da playlist?")) return;

    await supabase.from("playlist_items").delete().eq("id", itemId);
    loadData();
  }

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-4">
        Editar Playlist: {playlist?.name}
      </h1>

      {loading && <p className="text-gray-600">Carregando…</p>}

      {/* LISTA DE ITENS */}
      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">Itens da Playlist</h2>

          {items.length === 0 && (
            <p className="text-gray-500 mb-4">Nenhum item nesta playlist.</p>
          )}

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.assets.filename}</p>
                  <p className="text-sm text-gray-600">
                    Duração: {item.duration_seconds}s
                  </p>
                </div>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          {/* BOTÃO ADICIONAR */}
          <button
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => setAdding(true)}
          >
            + Adicionar Mídia
          </button>
        </>
      )}
