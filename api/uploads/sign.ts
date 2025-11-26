// api/uploads/sign.ts
import fetch from "node-fetch"; // se seu runtime permitir, senão use axios
import { supabase } from "../../lib/supabaseAdmin";

const B2_ACCOUNT_ID = process.env.B2_ACCOUNT_ID!;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY!;
const B2_BUCKET_ID = process.env.B2_BUCKET_ID!;     // bucketId (não o nome) — ver console Backblaze
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME!; // opcional: nome do bucket para montar URL final

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { filename, mime, client_id } = req.body;
    if (!filename || !client_id) return res.status(400).json({ error: "missing" });

    // 1) Autorize account (get apiUrl + auth token)
    const auth = Buffer.from(`${B2_ACCOUNT_ID}:${B2_APPLICATION_KEY}`).toString("base64");
    const authResp = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!authResp.ok) {
      const t = await authResp.text();
      return res.status(500).json({ error: "b2 authorize failed", detail: t });
    }
    const authJson = await authResp.json();
    const apiUrl = authJson.apiUrl;
    const accountAuthToken = authJson.authorizationToken;

    // 2) criar storagePath (sua convenção: clientId/timestamp-filename)
    const timestamp = Date.now();
    // preserve original extension
    const safeName = filename.replace(/\s+/g, "_");
    const storagePath = `${client_id}/${timestamp}-${safeName}`;

    // 3) pedir upload url pro bucket
    const getUploadUrlResp = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: accountAuthToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId: B2_BUCKET_ID }),
    });

    if (!getUploadUrlResp.ok) {
      const t = await getUploadUrlResp.text();
      return res.status(500).json({ error: "b2_get_upload_url failed", detail: t });
    }

    const uploadData = await getUploadUrlResp.json();
    const uploadUrl = uploadData.uploadUrl;
    const uploadAuthToken = uploadData.authorizationToken;

    // 4) retornar info para o frontend
    // o frontend deve:
    //  - fazer POST para uploadUrl com headers:
    //    Authorization: uploadAuthToken
    //    X-Bz-File-Name: encodeURIComponent(storagePath)
    //    Content-Type: mime
    //    X-Bz-Content-Sha1: do_not_verify
    //
    //  - e body: file
    //
    // após isso, o frontend grava metadados em 'assets' (veja cliente)
    const bucketFileUrl = `https://f000.backblazeb2.com/file/${B2_BUCKET_NAME}/${storagePath}`;

    return res.json({
      uploadUrl,
      uploadAuthToken,
      storagePath,
      bucketFileUrl,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error", detail: String(err) });
  }
}
