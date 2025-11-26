import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminLayout from "../components/AdminLayout";

export default function AdminPendingTotens() {
  const [pending, setPending] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectClient, setSelectClient] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);

  async function load() {
    setLoading(true);

    // busca pendentes
    const { data: pend } = await supabase
      .from("pending_devices")
      .select("*")
      .order("created_at", { ascending: false });

    setPending(pend || []);

    // busca clientes
    const { data: cls } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name", { ascending: true });

    setClients(cls || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // autorizar toten
  async function authorizeDevice() {
    if (!selectClient || !selectedDevice) return alert("Selecione um cliente");

    // 1 - cria toten oficial
    await supabase.from("totens").insert({
      client_id: selectClient,
      device_id: selectedDevice.device_id,
      model: selectedDevice.model,
      authorized: true,
      status: "offline",
      name: `Totem ${selectedDevice.device_id.substring(0, 6)}`
    });

    // 2 - remove da pending
    await supabase
      .from("pending_devices")
      .delete()
      .eq("id", selectedDevice.id);

    alert("Toten autorizado com sucesso!");

    setSelectedDevice(null);
    setSelectClient("");
    load();
  }

  // recusar pendente
  async function reject(id) {
    if (!confirm("Deseja recusar esse toten?")) return;

    await supabase.from("pending_devices").delete().eq("id", id);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Totens Não Autorizados</h1>

      {loading && <p>Carregando…</p>}

      {!loading && pending.length === 0 && (
        <p className="text-gray-500">Nenhum toten pendente.</p>
      )}

      {!loading && pending.length > 0 && (
        <div className="space-y-4">

          {pending.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div>
                <p><strong>Device ID:</strong> {p.device_id}</p>
                <p><strong>Modelo:</strong> {p.model || "—"}</p>
                <p className="text-gray-500">
                  Solicitado em: {new Date(p.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => setSelectedDevice(p)}
                >
                  Autorizar
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => reject(p.id)}
                >
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE AUTORIZAÇÃO */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">

            <h2 className="text-xl font-bold mb-4">Autorizar Toten</h2>

            <p className="mb-4">
              <strong>Device:</strong> {selectedDevice.device_id}
            </p>

            <label className="font-semibold">Selecione o cliente:</label>
            <select
              value={selectClient}
              onChange={(e) => setSelectClient(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Selecione…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-5">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={authorizeDevice}
              >
                Confirmar
              </button>

              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setSelectedDevice(null)}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
