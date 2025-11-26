import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminLayout from "../components/AdminLayout";

export default function AdminTotensList() {
  const [totens, setTotens] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAuth, setFilterAuth] = useState("all");

  async function loadData() {
    setLoading(true);

    const { data: t } = await supabase
      .from("totens")
      .select(`
        id,
        name,
        device_id,
        status,
        authorized,
        playlist_id,
        ip_address,
        last_seen,
        client_id,
        clients(company_name),
        playlists(name)
      `)
      .order("created_at", { ascending: false });

    setTotens(t || []);

    const { data: c } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name", { ascending: true });

    setClients(c || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // FILTRAR TOTENS
  const filteredTotens = totens.filter((t) => {
    if (search) {
      const s = search.toLowerCase();
      if (
        !t.name?.toLowerCase().includes(s) &&
        !t.device_id?.toLowerCase().includes(s)
      ) {
        return false;
      }
    }

    if (filterClient !== "all" && t.client_id !== filterClient) return false;

    if (filterStatus !== "all" && t.status !== filterStatus) return false;

    if (filterAuth !== "all") {
      if (filterAuth === "authorized" && !t.authorized) return false;
      if (filterAuth === "unauthorized" && t.authorized) return false;
    }

    return true;
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Todos os Totens</h1>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow mb-5 flex flex-col gap-4">

        <input
          type="text"
          placeholder="Buscar por nome ou device ID…"
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* CLIENTE */}
          <select
            className="border p-2 rounded"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="all">Todos os clientes</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          {/* AUTORIZAÇÃO */}
          <select
            className="border p-2 rounded"
            value={filterAuth}
            onChange={(e) => setFilterAuth(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="authorized">Autorizados</option>
            <option value="unauthorized">Não autorizados</option>
          </select>

        </div>
      </div>

      {/* LISTA DE TOTENS */}
      <div className="space-y-4">

        {loading && <p>Carregando…</p>}

        {!loading && filteredTotens.length === 0 && (
          <p className="text-gray-500">Nenhum toten encontrado.</p>
        )}

        {!loading &&
          filteredTotens.map((t) => (
            <div
              key={t.id}
              className="bg-white border rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-xl font-semibold">{t.name}</p>
                <p className="text-gray-600">
                  <strong>Cliente:</strong> {t.clients?.company_name}
                </p>
                <p className="text-gray-600">
                  <strong>Device ID:</strong> {t.device_id}
                </p>

                <p className="text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      t.status === "online"
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {t.status}
                  </span>
                </p>

                <p className="text-gray-600">
                  <strong>Autorizado:</strong>{" "}
                  <span
                    className={
                      t.authorized
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {t.authorized ? "SIM" : "NÃO"}
                  </span>
                </p>

                <p className="text-gray-500 text-sm">
                  Último contato:{" "}
                  {t.last_seen
                    ? new Date(t.last_seen).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
                  onClick={() => (window.location.href = `/admin/totens/${t.id}`)}
                >
                  Detalhes
                </button>

                <button
                  className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                  onClick={() =>
                    (window.location.href = `/admin/totens/${t.id}/playlist`)
                  }
                >
                  Playlist
                </button>

                <button
                  className="bg-indigo-700 text-white px-3 py-1 rounded hover:bg-indigo-800"
                  onClick={() =>
                    (window.location.href = `/admin/totens/${t.id}/logs`)
                  }
                >
                  Logs
                </button>

              </div>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
}
