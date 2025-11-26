import { supabase } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { device_id, model } = req.body;

  // Tenta localizar o toten no banco
  const { data: toten } = await supabase
    .from("totens")
    .select("*")
    .eq("device_id", device_id)
    .single();

  // Se não existir → add em pending_devices
  if (!toten) {
    await supabase.from("pending_devices").insert({
      device_id,
      model,
      client_request: null,
    });

    return res.json({
      authorized: false,
      status: "PENDING",
    });
  }

  // Se existir mas não for autorizado
  if (!toten.authorized) {
    return res.json({
      authorized: false,
      status: "UNAUTHORIZED",
    });
  }

  // Se tudo ok
  res.json({
    authorized: true,
    toten_id: toten.id,
  });
}
