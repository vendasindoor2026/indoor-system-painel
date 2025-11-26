import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminAdminsNew() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");

  async function save() {
    if (!email || !userId || !name)
      return alert("Preencha todos os campos.");

    const { error } = await supabase
      .from("admins")
      .insert({ user_id: userId, name });

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    alert("Administrador cadastrado!");
    window.location.href = "/admin/admins";
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Novo Administrador</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-xl">

        <label className="block font-semibold">E-mail do usuário</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@empresa.com"
        />

        <label className="block font-semibold mt-4">
          ID do usuário no Supabase (auth.users)
        </label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UUID do Supabase"
        />

        <label className="block font-semibold mt-4">Nome completo</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do administrador"
        />

        <button
          onClick={save}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Cadastrar Administrador
        </button>

        <button
          onClick={() => (window.location.href = "/admin/admins")}
          className="mt-4 ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </AdminLayout>
  );
}
