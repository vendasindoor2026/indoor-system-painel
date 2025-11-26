import { supabase } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { device_id, event, message } = req.body;

  await supabase.rpc("add_toten_log", {
    device_id,
    event,
    msg: message,
  });

  res.json({ ok: true });
}
