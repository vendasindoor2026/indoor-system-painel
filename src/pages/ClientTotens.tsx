import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientTotens() {
  const [totens, setTotens] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTotens() {
    setLoading(true);

    // pega usuário logado
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    // pega client_id
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!client) return;

    // pega totens + playlist atual
    const { data, error } = await supabase
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
        playlists(name)
      `)
      .eq("client_id", client.id)
      .eq("authorized", true)
      .order("created_at", { ascending: false });

    if (!error) setTotens(data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadTotens();
  }, []);

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-6">Meus Totens</h1>

      {loading && <p className="text-gray-500">Carregando…</p>}

      {!loading && totens.length === 0 && (
        <p className="text-gray-500">Nenhum toten encontrado.</p>
      )}

      {!loading && totens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {totens.map((t) => (
            <div
              key={t.id}
              className="bg-white border rounded-xl shadow p-5 flex flex-col"
            >
              <h2 className="text-xl font-semibold">{t.name || "Totem sem nome"}</h2>

              <p className="mt-2 text-sm text-gray-700">
                <strong>Device ID:</strong> {t.device_id}
              </p>

              <p className="text-sm text-gray-700">
                <strong>Modelo:</strong> {t.model || "—"}
              </p>

              <p className="text-sm mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    t.status === "online"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {t.status === "online" ? "Online" : "Offline"}
                </span>
              </p>

              <p className="text-sm text-gray-700">
                <strong>IP:</strong> {t.ip_address || "—"}
              </p>

              <p className="text-sm text-gray-700">
                <strong>Última sincronização:</strong>{" "}
                {t.last_seen ? new Date(t.last_seen).toLocaleString() : "—"}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <strong>Playlist atual:</strong>{" "}
                {t.playlists?.name || "Nenhuma"}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  onClick={() => (window.location.href = `/client/totens/${t.id}`)}
                >
                  Ver detalhes
                </button>

                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => (window.location.href = `/client/totens/${t.id}/playlist`)}
                >
                  Trocar playlist
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </ClientLayout>
  );
}
