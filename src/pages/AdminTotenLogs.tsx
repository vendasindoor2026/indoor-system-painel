import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AdminLayout from "../components/AdminLayout";

export default function AdminTotenLogs() {
  const { id } = useParams(); // id do toten
  const [logs, setLogs] = useState([]);
  const [toten, setToten] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);

    // pega dados do toten
    const { data: t } = await supabase
      .from("totens")
      .select(`
        id,
        name,
        device_id,
        clients(company_name)
      `)
      .eq("id", id)
      .single();

    setToten(t);

    // pega logs
    const { data: logsResp } = await supabase
      .from("toten_logs")
      .select("*")
      .eq("toten_id", id)
      .order("created_at", { ascending: false });

    setLogs(logsResp || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // filtro simples
  const filteredLogs = logs.filter((l) => {
    if (filter === "all") return true;
    return l.event_type === filter;
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Logs do Toten</h1>

      {loading && <p>Carregando logs…</p>}

      {!loading && toten && (
        <div className="mb-6 bg-white border rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-1">
            {toten.name || "Toten sem nome"}
          </h2>
          <p>
            <strong>Device ID:</strong> {toten.device_id}
          </p>
          <p>
            <strong>Cliente:</strong> {toten.clients?.company_name}
          </p>
        </div>
      )}

      {/* FILTROS */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFilter("sync")}
          className={`px-3 py-1 rounded ${
            filter === "sync" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Sincronização
        </button>

        <button
          onClick={() => setFilter("play_video")}
          className={`px-3 py-1 rounded ${
            filter === "play_video" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Reprodução
        </button>

        <button
          onClick={() => setFilter("error")}
          className={`px-3 py-1 rounded ${
            filter === "error" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Erros
        </button>
      </div>

      {/* LISTA DE LOGS */}
      <div className="bg-white rounded-xl shadow border p-5">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500">Nenhum log encontrado.</p>
        ) : (
          <ul className="divide-y">
            {filteredLogs.map((log) => (
              <li key={log.id} className="py-3">
                <div className="flex justify-between">
                  <span
                    className={`font-semibold ${
                      log.event_type === "error"
                        ? "text-red-600"
                        : log.event_type === "sync"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {log.event_type.toUpperCase()}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 mt-1">{log.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </AdminLayout>
  );
}
