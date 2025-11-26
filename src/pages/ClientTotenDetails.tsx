import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientTotenDetails() {
  const { id } = useParams();
  const [toten, setToten] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadToten() {
    setLoading(true);

    // pegar usuário
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    // pegar client_id
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    // buscar toten
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
      .eq("id", id)
      .single();

    if (!error) setToten(data);
    setLoading(false);
  }

  useEffect(() => {
    loadToten();
  }, [id]);

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-6">Detalhes do Toten</h1>

      {loading && <p>Carregando informações…</p>}

      {!loading && !toten && (
        <p className="text-gray-500">Totem não encontrado.</p>
      )}

      {!loading && toten && (
        <div className="bg-white border shadow rounded-lg p-6 max-w-2xl">

          {/* Nome */}
          <h2 className="text-xl font-semibold mb-4">
            {toten.name || "Totem sem nome"}
          </h2>

          {/* Informações principais */}
          <div className="space-y-2 text-gray-800">
            <p>
              <strong>Device ID:</strong> {toten.device_id}
            </p>

            <p>
              <strong>Modelo:</strong> {toten.model || "—"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  toten.status === "online"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {toten.status === "online" ? "Online" : "Offline"}
              </span>
            </p>

            <p>
              <strong>IP:</strong> {toten.ip_address || "—"}
            </p>

            <p>
              <strong>Última sincronização:</strong>{" "}
              {toten.last_seen
                ? new Date(toten.last_seen).toLocaleString()
                : "Nunca"}
            </p>

            <p>
              <strong>Playlist atual:</strong>{" "}
              {toten.playlists?.name || "Nenhuma"}
            </p>
          </div>

          {/* AÇÕES */}
          <div className="mt-6 flex gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() =>
                (window.location.href = `/client/totens/${toten.id}/playlist`)
              }
            >
              Trocar playlist
            </button>

            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={() =>
                (window.location.href = `/client/totens/${toten.id}/logs`)
              }
            >
              Ver logs
            </button>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
