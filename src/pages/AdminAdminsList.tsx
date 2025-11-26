import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminAdminsList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admins")
      .select(`
        id,
        name,
        user_id,
        created_at,
        auth: user_id ( email )
      `)
      .order("created_at", { ascending: false });

    if (!error) {
      setAdmins(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Administradores</h1>

      <button
        onClick={() => (window.location.href = "/admin/admins/new")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Novo Administrador
      </button>

      <div className="bg-white p-6 rounded-xl shadow border">
        {loading && <p>Carregando...</p>}

        {!loading && admins.length === 0 && (
          <p className="text-gray-500">Nenhum administrador cadastrado.</p>
        )}

        {!loading && admins.length > 0 && (
          <div className="space-y-4">
            {admins.map((adm) => (
              <div
                key={adm.id}
                className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="text-lg font-semibold">{adm.name}</p>
                  <p className="text-gray-600">{adm.auth?.email}</p>
                  <p className="text-gray-600">
                    Criado: {new Date(adm.created_at).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => (window.location.href = `/admin/admins/${adm.id}/edit`)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
