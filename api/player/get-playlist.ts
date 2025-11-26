import { supabase } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { device_id } = req.body;

  // pega playlist atual
  const { data: toten } = await supabase
    .from("totens")
    .select("playlist_id, playlists(name)")
    .eq("device_id", device_id)
    .single();

  if (!toten || !toten.playlist_id)
    return res.json({ playlist: null });

  const { data: items } = await supabase
    .from("playlist_items")
    .select("order_index, duration_seconds, assets(*)")
    .eq("playlist_id", toten.playlist_id)
    .order("order_index", { ascending: true });

  const playlist = items.map((i) => ({
    duration: i.duration_seconds,
    url: `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET}/${i.assets.storage_path}`,
    type: i.assets.mime.startsWith("image/") ? "image" : "video",
  }));

  res.json({
    playlist_name: toten.playlists?.name,
    items: playlist,
  });
}
