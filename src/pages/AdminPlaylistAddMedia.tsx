import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminPlaylistAddMedia() {
  const { id } = useParams(); // playlist ID

  const [playlist, setPlaylist] = useState(null);
  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);

    // pegar playlist + cliente
    const { data: playlistData } = await supabase
      .from("playlists")
      .select("id, name, client_id")
      .eq("id", id)
      .single();

    setPlaylist(playlistData);

    // pegar mídias do cliente
    const { data: mediaData } = await supabase
      .from("assets")
      .select("id, filename, mime, storage_path, size")
      .eq("client_id", playlistData.client_id)
      .order("uploaded_at", { ascending: false });

    setMedia(mediaData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  function isImage(mime) {
    return mime.startsWith("image/");
  }

  function isVideo(mime) {
    return mime.startsWith("video/");
  }

  async function addItem() {
    if (!selected) {
      alert("Selecione uma mídia.");
      return;
    }

    setSaving(true);

    // pegar último order_index
    const { data: countData } = await supabase
      .from("playlist_items")
      .select("order_index")
      .eq("playlist_id", id)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrder = countData?.[0]?.order_index + 1 || 0;

    // inserir item da playlist
    const { error } = await supabase.from("playlist_items").insert({
      playlist_id: id,
      asset_id: selected.id,
      duration_seconds: isVideo(selected.mime) ? 0 : duration,
      order_index: nextOrder,
      loop: true,
    });

    setSaving(false);

    if (error) {
      alert("Erro ao adicionar mídia: " + error.message);
      return;
    }

    alert("Mídia adicionada à playlist!");
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
        Adicionar Mídias — {playlist?.name}
      </h1>

      {/* LISTA DE MIDIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {media.map((m) => (
          <div
            key={m.id}
            className={`bg-white p-4 rounded-xl border shadow cursor-pointer hover:shadow-lg ${
              selected?.id === m.id ? "border-blue-600" : "border-gray-300"
            }`}
            onClick={() => setSelected(m)}
          >
            <p className="font-semibold text-lg">{m.filename}</p>
            <p className="text-gray-600 text-sm">{m.mime}</p>

            <div className="mt-3">
              {isImage(m.mime) && (
                <img
                  src={m.storage_path}
                  className="rounded border max-h-40"
                />
              )}

              {isVideo(m.mime) && (
                <video
                  src={m.storage_path}
                  controls
                  className="rounded border max-h-40"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FORMULÁRIO DE DURAÇÃO */}
      {selected && isImage(selected.mime) && (
        <div className="mt-6 bg-white p-6 rounded-xl border max-w-md shadow">
          <label className="font-semibold block">Duração (segundos)</label>
          <input
            type="number"
            min={1}
            className="border p-2 rounded w-full mt-1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
      )}

      {/* BOTÕES */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={addItem}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Adicionar à Playlist
        </button>

        <button
          onClick={() => (window.location.href = `/admin/playlists/${id}`)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </AdminLayout>
  );
}
