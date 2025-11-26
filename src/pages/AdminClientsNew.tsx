import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminClientsNew() {
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!companyName.trim()) {
      alert("Digite um nome de cliente");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("clients").insert({
      company_name: companyName,
      created_at: new Date(),
    });

    setSaving(false);

    if (error) {
      alert("Erro ao criar cliente: " + error.message);
      return;
    }

    alert("Cliente criado com sucesso!");
    window.location.href = "/admin/clients";
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Novo Cliente</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-xl">
        <label className="block font-semibold">Nome da Empresa</label>
        <input
          type="text"
          className="w-full border p-2 rounded mt-1"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <button
          onClick={create}
          disabled={saving}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Salvar
        </button>

        <button
          onClick={() => (window.location.href = "/admin/clients")}
          className="mt-4 ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </AdminLayout>
  );
}
