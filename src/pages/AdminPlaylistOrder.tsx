import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";
import Sortable from "sortablejs";

export default function AdminPlaylistOrder() {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const listRef = useRef(null);

  async function load() {
    setLoading(true);

    // playlist + cliente
    const { data: playlistData } = await supabase
      .from("playlists")
      .select("id, name, client_id")
      .eq("id", id)
      .single();

    setPlaylist(playlistData);

    // itens
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

  // inicializa drag & drop
  useEffect(() => {
    if (!listRef.current) return;

    Sortable.create(listRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: (evt) => {
        const newItems = [...items];
        const [removed] = newItems.splice(evt.oldIndex, 1);
        newItems.splice(evt.newIndex, 0, removed);
        setItems(newItems);
      },
    });
  }, [items]);

  // salvar nova ordem no banco
  async function saveOrder() {
    setSaving(true);

    for (let i = 0; i < items.length; i++) {
      await supabase
        .from("playlist_items")
        .update({ order_index: i })
        .eq("id", items[i].id);
    }

    setSaving(false);
    alert("Ordem salva com sucesso!");
    window.location.href = `/admin/playlists/${id}`;
  }

  if (loading) {
    return (
      <AdminLayout>
        <p>Carregando...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Ordenar Itens — {playlist?.name}
      </h1>

      <p className="text-gray-600 mb-6">
        Arraste os itens para alterar a ordem.
      </p>

      {/* LISTA ARRASTÁVEL */}
      <div
        ref={listRef}
        className="space-y-4 bg-white p-6 rounded-xl shadow border max-w-3xl"
      >
        {items.map((item, index) => {
          const asset = item.assets;
          const isImage = asset.mime.startsWith("image/");
          const isVideo = asset.mime.startsWith("video/");

          return (
            <div
              key={item.id}
              className="p-4 border rounded-lg shadow flex items-center gap-4 bg-gray-50"
            >
              {/* handle */}
              <span className="drag-handle cursor-move text-2xl">☰</span>

              {/* preview */}
              <div className="w-20">
                {isImage && (
                  <img
                    src={asset.storage_path}
                    className="rounded border max-h-16"
                  />
                )}

                {isVideo && (
                  <video
                    src={asset.storage_path}
                    className="rounded border max-h-16"
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold">{asset.filename}</p>
                <p className="text-gray-500 text-sm">
                  {asset.mime} — {item.duration_seconds}s
                </p>
              </div>

              <div className="text-gray-500">
                #{index}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÕES */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={saveOrder}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Salvar Ordem
        </button>

        <button
          onClick={() => (window.location.href = `/admin/playlists/${id}`)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Voltar
        </button>
      </div>
    </AdminLayout>
  );
}
