import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminAdminsEdit() {
  const { id } = useParams();

  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");

  async function load() {
    const { data } = await supabase
      .from("admins")
      .select("id, name, user_id")
      .eq("id", id)
      .single();

    setAdmin(data);
    setName(data.name);
  }

  async function save() {
    if (!name.trim()) return alert("Nome inválido");

    const { error } = await supabase
      .from("admins")
      .update({ name })
      .eq("id", id);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    alert("Administrador atualizado!");
    window.location.href = "/admin/admins";
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Editar Administrador</h1>

      {admin && (
        <div className="bg-white p-6 rounded-xl shadow border max-w-xl">

          <p className="text-gray-600 mb-4">
            <strong>E-mail:</strong> {admin.user_id}
          </p>

          <label className="block font-semibold">Nome completo</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={save}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Salvar
          </button>

          <button
            onClick={() => (window.location.href = "/admin/admins")}
            className="mt-4 ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
