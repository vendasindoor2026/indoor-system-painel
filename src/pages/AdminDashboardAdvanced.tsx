import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboardAdvanced() {
  const [counts, setCounts] = useState({
    totens: 0,
    online: 0,
    offline: 0,
    authorized: 0,
    pending: 0,
    clients: 0,
    playlists: 0,
  });

  const [barData, setBarData] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  async function load() {
    // TOTAL DE TOTENS
    const { data: totens } = await supabase
      .from("totens")
      .select("id, status, authorized, client_id");

    // CLIENTES
    const { data: clients } = await supabase.from("clients").select("id");

    // PLAYLISTS
    const { data: playlists } = await supabase.from("playlists").select("id");

    // LOGS RECENTES
    const { data: logs } = await supabase
      .from("toten_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    // Calcular quantidades
    const online = totens.filter((t) => t.status === "online").length;
    const offline = totens.filter((t) => t.status === "offline").length;
    const authorized = totens.filter((t) => t.authorized).length;
    const pending = totens.filter((t) => !t.authorized).length;

    // Totens por cliente (gráfico de barras)
    const group = {};
    totens.forEach((t) => {
      if (!group[t.client_id]) group[t.client_id] = 0;
      group[t.client_id]++;
    });

    // pega nome de cliente
    const { data: clientInfo } = await supabase
      .from("clients")
      .select("id, company_name");

    const labels = [];
    const values = [];

    Object.keys(group).forEach((clientId) => {
      const found = clientInfo.find((c) => c.id === clientId);
      labels.push(found?.company_name || "Cliente");
      values.push(group[clientId]);
    });

    setBarData({
      labels,
      datasets: [
        {
          label: "Totens por cliente",
          data: values,
          backgroundColor: ["#4F46E5"],
        },
      ],
    });

    setCounts({
      totens: totens.length,
      online,
      offline,
      authorized,
      pending,
      clients: clients.length,
      playlists: playlists.length,
    });

    setRecentLogs(logs || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Avançado</h1>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Totens Ativos" value={counts.totens} color="blue" />
        <Card title="Clientes" value={counts.clients} color="green" />
        <Card title="Playlists" value={counts.playlists} color="purple" />
      </div>

      {/* GRAFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

        {/* DONUT — STATUS ONLINE / OFFLINE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Status dos Totens</h2>
          <Doughnut
            data={{
              labels: ["Online", "Offline"],
              datasets: [
                {
                  data: [counts.online, counts.offline],
                  backgroundColor: ["#10B981", "#EF4444"],
                },
              ],
            }}
          />
        </div>

        {/* BARRAS — TOTENS POR CLIENTE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Totens Por Cliente</h2>
          {barData ? <Bar data={barData} /> : <p>Carregando…</p>}
        </div>
      </div>

      {/* LOGS RECENTES */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Últimos Logs</h2>

        <ul className="divide-y">
          {recentLogs.map((l) => (
            <li key={l.id} className="py-3">
              <div className="flex justify-between">
                <span className="font-medium">{l.event_type}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(l.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{l.message}</p>
            </li>
          ))}
        </ul>

        {recentLogs.length === 0 && (
          <p className="text-gray-500">Nenhum log registrado.</p>
        )}
      </div>
    </AdminLayout>
  );
}

function Card({ title, value, color }) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-8" style={{ borderColor: colors[color].replace("bg-", "") }}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${colors[color]} text-white p-2 rounded`}>
        {value}
      </p>
    </div>
  );
}
