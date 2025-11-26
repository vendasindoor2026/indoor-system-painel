import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminTotenDetails() {
  const { id } = useParams();
  const [toten, setToten] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);

    const { data } = await supabase
      .from("totens")
      .select(`
        id,
        name,
        device_id,
        model,
        status,
        ip_address,
        last_seen,
        playlist_id,
        authorized,
        client_id,
        clients(company_name),
        playlists(name)
      `)
      .eq("id", id)
      .single();

    setToten(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function updateAuthorization(newState) {
    setSaving(true);

    await supabase
      .from("totens")
      .update({ authorized: newState })
      .eq("id", id);

    setSaving(false);
    loadData();
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Detalhes do Toten</h1>

      {loading && <p>Carregando…</p>}

      {!loading && !toten && (
        <p className="text-gray-500">Totem não encontrado.</p>
      )}

      {!loading && toten && (
        <div className="bg-white shadow-lg border rounded-xl p-6 max-w-3xl">

          <h2 className="text-2xl font-semibold mb-4">
            {toten.name || "Toten sem nome"}
          </h2>

          {/* INFORMAÇÕES PRINCIPAIS */}
          <div className="space-y-2 text-gray-700">
            <p><strong>Cliente:</strong> {toten.clients?.company_name || "—"}</p>
            <p><strong>Device ID:</strong> {toten.device_id}</p>
            <p><strong>Modelo:</strong> {toten.model || "—"}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  toten.status === "online"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {toten.status}
              </span>
            </p>

            <p><strong>IP:</strong> {toten.ip_address || "—"}</p>
            <p><strong>Último contato:</strong> {toten.last_seen ? new Date(toten.last_seen).toLocaleString() : "—"}</p>

            <p><strong>Playlist atual:</strong> {toten.playlists?.name || "Nenhuma"}</p>

            <p>
              <strong>Autorizado:</strong>{" "}
              <span className={toten.authorized ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {toten.authorized ? "SIM" : "NÃO"}
              </span>
            </p>
          </div>

          {/* BOTÕES */}
          <div className="mt-6 flex gap-3">

            {/* Autorizar / Bloquear */}
            <button
              disabled={saving}
              onClick={() => updateAuthorization(!toten.authorized)}
              className={`px-4 py-2 rounded text-white ${
                toten.authorized ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {toten.authorized ? "Bloquear Toten" : "Autorizar Toten"}
            </button>

            {/* Trocar Playlist */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() =>
                (window.location.href = `/admin/totens/${toten.id}/playlist`)
              }
            >
              Trocar playlist
            </button>

            {/* Ver Logs */}
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={() =>
                (window.location.href = `/admin/totens/${toten.id}/logs`)
              }
            >
              Ver Logs
            </button>

          </div>

        </div>
      )}
    </AdminLayout>
  );
}
