import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminPlaylistsNew() {
  const [name, setName] = useState("");
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadClients() {
    const { data } = await supabase
      .from("clients")
      .select("id, company_name")
      .order("company_name");

    setClients(data || []);
  }

  async function create() {
    if (!name.trim() || !clientId) {
      alert("Preencha todos os campos.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("playlists")
      .insert({
        name,
        client_id: clientId,
        created_at: new Date(),
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    window.location.href = `/admin/playlists/${data.id}`;
  }

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Nova Playlist</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-xl">

        <label className="block font-semibold">Nome da Playlist</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block font-semibold mt-4">Cliente</label>
        <select
          className="w-full border p-2 rounded mt-1"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">Selecione</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.company_name}
            </option>
          ))}
        </select>

        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={saving}
          onClick={create}
        >
          Criar Playlist
        </button>

        <button
          onClick={() => (window.location.href = "/admin/playlists")}
          className="mt-4 ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </AdminLayout>
  );
}
