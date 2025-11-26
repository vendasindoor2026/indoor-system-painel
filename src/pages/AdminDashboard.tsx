import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (data.user?.user_metadata.role !== "admin") {
        window.location.href = "/login";
      }
    }
    check();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard do Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card total clientes */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Clientes</h2>
          <p className="text-3xl font-bold text-indigo-700">12</p>
        </div>

        {/* Card playlists */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Playlists</h2>
          <p className="text-3xl font-bold text-indigo-700">34</p>
        </div>

        {/* Card dispositivos */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Dispositivos</h2>
          <p className="text-3xl font-bold text-indigo-700">54</p>
        </div>

      </div>

      <div className="mt-10 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Visão Geral</h2>
        <p className="text-gray-600">
          Aqui você acompanha rapidamente o status de clientes, playlists, mídias e dispositivos instalados.
        </p>
      </div>
    </AdminLayout>
  );
}
