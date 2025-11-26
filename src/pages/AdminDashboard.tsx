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

        {/* CARD: Clientes */}
<div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition border border-indigo-400/40">
  <div className="flex items-center gap-4">
    <div className="p-4 bg-indigo-100 rounded-full">
      <span className="text-indigo-700 text-3xl">👥</span>
    </div>
    <div>
      <h2 className="text-xl font-semibold">Clientes</h2>
      <p className="text-4xl font-bold text-indigo-700">12</p>
    </div>
  </div>
</div>

{/* CARD: Playlists */}
<div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition border border-purple-400/40">
  <div className="flex items-center gap-4">
    <div className="p-4 bg-purple-100 rounded-full">
      <span className="text-purple-700 text-3xl">🎵</span>
    </div>
    <div>
      <h2 className="text-xl font-semibold">Playlists</h2>
      <p className="text-4xl font-bold text-purple-700">34</p>
    </div>
  </div>
</div>

{/* CARD: Dispositivos */}
<div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition border border-blue-400/40">
  <div className="flex items-center gap-4">
    <div className="p-4 bg-blue-100 rounded-full">
      <span className="text-blue-700 text-3xl">📺</span>
    </div>
    <div>
      <h2 className="text-xl font-semibold">Dispositivos</h2>
      <p className="text-4xl font-bold text-blue-700">54</p>
    </div>
  </div>
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
