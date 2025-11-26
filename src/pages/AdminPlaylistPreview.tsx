import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminPlaylistPreview() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function loadPlaylist() {
    setLoading(true);

    const { data } = await supabase
      .from("playlist_items")
      .select(`
        id,
        order_index,
        duration_seconds,
        assets (
          filename,
          mime,
          storage_path
        )
      `)
      .eq("playlist_id", id)
      .order("order_index", { ascending: true });

    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  // Avança para o próximo item no tempo definido
  useEffect(() => {
    if (!playing || items.length === 0) return;

    const item = items[current];
    if (!item) return;

    // imagens → troca com timer
    if (item.assets.mime.startsWith("image/")) {
      const timer = setTimeout(() => {
        nextItem();
      }, (item.duration_seconds || 5) * 1000);
      return () => clearTimeout(timer);
    }

    // vídeos → espera o vídeo terminar
    if (item.assets.mime.startsWith("video/")) {
      const video = videoRef.current;
      if (video) {
        const handler = () => nextItem();
        video.addEventListener("ended", handler);
        return () => video.removeEventListener("ended", handler);
      }
    }
  }, [current, playing, items]);

  function nextItem() {
    setCurrent((prev) => (prev + 1 < items.length ? prev + 1 : 0));
  }

  function prevItem() {
    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : items.length - 1));
  }

  function restart() {
    setCurrent(0);
    setPlaying(true);
  }

  if (loading) {
    return (
      <AdminLayout>
        <p>Carregando...</p>
      </AdminLayout>
    );
  }

  if (items.length === 0) {
    return (
      <AdminLayout>
        <p className="text-gray-500">Esta playlist não possui itens.</p>
      </AdminLayout>
    );
  }

  const item = items[current];
  const asset = item.assets;
  const isImage = asset.mime.startsWith("image/");
  const isVideo = asset.mime.startsWith("video/");

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Preview da Playlist</h1>

      <div className="bg-white p-6 rounded-xl shadow border">

        <p className="text-lg mb-3">
          <strong>Item {current + 1}</strong> de {items.length}
        </p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setPlaying(!playing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {playing ? "Pausar" : "Reproduzir"}
          </button>

          <button
            onClick={restart}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recomeçar
          </button>

          <button
            onClick={prevItem}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ◀ Anterior
          </button>

          <button
            onClick={nextItem}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Próximo ▶
          </button>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 flex justify-center bg-black">
          {isImage && (
            <img
              src={asset.storage_path}
              className="max-h-[500px] rounded"
            />
          )}

          {isVideo && (
            <video
              ref={videoRef}
              src={asset.storage_path}
              autoPlay={playing}
              controls
              className="max-h-[500px] rounded"
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
