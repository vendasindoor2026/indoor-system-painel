import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("clients")
      .select("id, company_name, created_at")
      .order("created_at", { ascending: false });

    setClients(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      <button
        onClick={() => (window.location.href = "/admin/clients/new")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Novo Cliente
      </button>

      <div className="bg-white p-6 rounded-xl shadow border">
        {loading && <p>Carregando...</p>}

        {!loading && clients.length === 0 && (
          <p className="text-gray-500">Nenhum cliente cadastrado.</p>
        )}

        {!loading && clients.length > 0 && (
          <div className="space-y-3">
            {clients.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="text-lg font-semibold">{c.company_name}</p>
                  <p className="text-gray-500 text-sm">
                    Criado em: {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>

                <button
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() =>
                    (window.location.href = `/admin/clients/${c.id}`)
                  }
                >
                  Abrir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
