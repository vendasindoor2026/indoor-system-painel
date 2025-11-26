import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminClientTotens() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [totens, setTotens] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // Carrega informações do cliente
    const { data: clientInfo } = await supabase
      .from("clients")
      .select("id, company_name")
      .eq("id", id)
      .single();

    setClient(clientInfo);

    // Carrega totens do cliente
    const { data: totensData } = await supabase
      .from("totens")
      .select("id, name, device_id, status, authorized, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false });

    setTotens(totensData || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Totens do Cliente — {client?.company_name}
      </h1>

      {loading && <p>Carregando...</p>}

      {!loading && totens.length === 0 && (
        <p className="text-gray-500">Nenhum toten encontrado para este cliente.</p>
      )}

      {!loading && totens.length > 0 && (
        <div className="space-y-4">
          {totens.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xl shadow border flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="text-xl font-semibold">{t.name || "Sem nome"}</p>

                <p className="text-gray-600">
                  <strong>ID:</strong> {t.id}
                </p>

                <p className="text-gray-600">
                  <strong>Device ID:</strong> {t.device_id}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      t.status === "online"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {t.status}
                  </span>
                </p>

                <p>
                  <strong>Autorizado:</strong>{" "}
                  <span
                    className={
                      t.authorized
                        ? "text-green-600 font-semibold"
                        : "text-orange-600 font-semibold"
                    }
                  >
                    {t.authorized ? "Sim" : "Pendente"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    (window.location.href = `/admin/totens/${t.id}`)
                  }
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Detalhes
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/admin/totens/${t.id}/playlist`)
                  }
                  className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Playlist
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/admin/totens/${t.id}/logs`)
                  }
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
