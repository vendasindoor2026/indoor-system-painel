import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("clients")
      .select("id, company_name, created_at")
      .eq("id", id)
      .single();

    setClient(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <p>Carregando...</p>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <p className="text-gray-500">Cliente não encontrado.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Cliente: {client.company_name}</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-2xl">

        <p className="text-gray-700">
          <strong>ID:</strong> {client.id}
        </p>

        <p className="text-gray-700">
          <strong>Criado em:</strong>{" "}
          {new Date(client.created_at).toLocaleString()}
        </p>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => (window.location.href = `/admin/clients/${id}/edit`)}
          >
            Editar Cliente
          </button>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => (window.location.href = `/admin/clients/${id}/totens`)}
          >
            Totens
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => (window.location.href = `/admin/clients/${id}/playlists`)}
          >
            Playlists
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => (window.location.href = `/admin/clients/${id}/media`)}
          >
            Mídias
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
