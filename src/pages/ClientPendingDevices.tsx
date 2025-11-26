import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";
// No arquivo src/pages/ClientPendingDevices.tsx
import ClientLayout from "../components/ClientLayout" 
// OU
import ClientLayout from "../components/ClientLayout.tsx"

export default function ClientPendingDevices() {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPendentes() {
    setLoading(true);

    // pega o usuário atual
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setPendentes([]);
      setLoading(false);
      return;
    }

    // busca o client_id do usuário logado
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!client) {
      setPendentes([]);
      setLoading(false);
      return;
    }

    // busca dispositivos pendentes DO CLIENTE
    const { data, error } = await supabase
      .from("pending_devices")
      .select("*")
      .eq("client_request", client.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setPendentes(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPendentes();
  }, []);

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-4">Dispositivos Pendentes</h1>

      {loading && <p className="text-gray-500">Carregando dispositivos...</p>}

      {!loading && pendentes.length === 0 && (
        <p className="text-gray-500">Nenhum dispositivo pendente.</p>
      )}

      {!loading && pendentes.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">Device ID</th>
                <th className="p-3 font-semibold">Modelo</th>
                <th className="p-3 font-semibold">Data</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {pendentes.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="p-3">{d.device_id}</td>
                  <td className="p-3">{d.model || "—"}</td>
                  <td className="p-3">
                    {new Date(d.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-orange-600 font-semibold">
                    Aguardando autorização do administrador
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ClientLayout>
  );
}
