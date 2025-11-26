// api/media/delete.ts
import fetch from "node-fetch";
import { supabase } from "../../lib/supabaseAdmin";

const B2_ACCOUNT_ID = process.env.B2_ACCOUNT_ID!;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY!;
const B2_BUCKET_ID = process.env.B2_BUCKET_ID!;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME!;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { asset_id } = req.body;
    if (!asset_id) return res.status(400).json({ error: "missing asset_id" });

    // 1) Carregar metadados da mídia
    const { data: asset, error } = await supabase
      .from("assets")
      .select("id, storage_path, client_id")
      .eq("id", asset_id)
      .single();

    if (error || !asset)
      return res.status(404).json({ error: "Asset not found" });

    // proteção extra: checar se mídia está em playlist
    const { data: used } = await supabase
      .from("playlist_items")
      .select("id")
      .eq("asset_id", asset_id);

    if (used && used.length > 0)
      return res.status(400).json({
        error: "Mídia sendo usada em playlists. Remova dos players primeiro.",
      });

    const storagePath = asset.storage_path; // ex: clientid/171322313-image.png

    // 2) Autorizar Backblaze
    const auth = Buffer.from(`${B2_ACCOUNT_ID}:${B2_APPLICATION_KEY}`).toString(
      "base64"
    );

    const authResp = await fetch(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    if (!authResp.ok) {
      const t = await authResp.text();
      return res.status(500).json({ error: "authorize_failed", detail: t });
    }

    const authJson = await authResp.json();
    const apiUrl = authJson.apiUrl;
    const accountAuthToken = authJson.authorizationToken;

    // 3) pegar fileId pelo nome (necessário para deletar)
    const listResp = await fetch(`${apiUrl}/b2api/v2/b2_list_file_names`, {
      method: "POST",
      headers: {
        Authorization: accountAuthToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: B2_BUCKET_ID,
        prefix: storagePath,
        maxFileCount: 1,
      }),
    });

    const listJson = await listResp.json();
    if (!listResp.ok || !listJson.files || listJson.files.length === 0) {
      return res.status(404).json({ error: "file_not_found_on_b2" });
    }

    const fileId = listJson.files[0].fileId;
    const fileName = listJson.files[0].fileName;

    // 4) deletar arquivo físico no Backblaze
    const delResp = await fetch(
      `${apiUrl}/b2api/v2/b2_delete_file_version`,
      {
        method: "POST",
        headers: {
          Authorization: accountAuthToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          fileId,
        }),
      }
    );

    if (!delResp.ok) {
      const t = await delResp.text();
      return res.status(500).json({ error: "delete_failed", detail: t });
    }

    // 5) remover registro da tabela assets
    await supabase.from("assets").delete().eq("id", asset_id);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error", detail: String(err) });
  }
}
