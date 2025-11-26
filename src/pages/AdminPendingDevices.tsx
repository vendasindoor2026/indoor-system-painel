import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminLayout from "../components/AdminLayout";

export default function AdminPendingDevices() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPending() {
    setLoading(true);

    const { data, error } = await supabase
      .from("pending_devices")
      .select("id, device_id, model, client_request, created_at")
      .order("created_at", { ascending: false });

    if (!error) setPending(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPending();
  }, []);

  // ---- AUTORIZAR ----
  async function authorizeDevice(device) {
    if (!confirm("Autorizar este dispositivo?")) return;

    // 1. Criar em 'totens'
    const { error: insertErr } = await supabase.from("totens").insert([
      {
        device_id: device.device_id,
        authorized: true,
        client_id: device.client_request || null,
      },
    ]);

    if (insertErr) {
      alert("Erro ao autorizar: " + insertErr.message);
      return;
    }

    // 2. Remover de pending
    await supabase.from("pending_devices").delete().eq("id", device.id);

    // 3. Atualizar lista
    loadPending();
  }

  // ---- EXCLUIR ----
  async function deletePending(device) {
    if (!confirm("Excluir este dispositivo?")) return;

    await supabase.from("pending_devices").delete().eq("id", device.id);
    loadPending();
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dispositivos Pendentes</h1>

        {loading && <p>Carregando...</p>}

        {!loading && pending.length === 0 && (
          <p className="text-gray-500">Nenhum dispositivo pendente.</p>
        )}

        {!loading && pending.length > 0 && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-semibold">Device ID</th>
                  <th className="p-3 font-semibold">Modelo</th>
                  <th className="p-3 font-semibold">Cliente</th>
                  <th className="p-3 font-semibold">Data</th>
                  <th className="p-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((d) => (
                  <tr key={d.id} className="border-b">
                    <td className="p-3">{d.device_id}</td>
                    <td className="p-3">{d.model || "—"}
