import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabase";

export default function AdminPlaylistEdit() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("playlists")
      .select("name")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setName(data.name);
    setLoading(false);
  }

  async function save() {
    if (!name.trim()) {
      alert("Digite um nome válido.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("playlists")
      .update({ name })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    alert("Nome atualizado com sucesso!");
    window.location.href = `/admin/playlists/${id}`;
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Editar Playlist</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow border max-w-xl">

          <label className="block font-semibold">Nome da Playlist</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={save}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Salvar Alterações
          </button>

          <button
            onClick={() => (window.location.href = `/admin/playlists/${id}`)}
            className="mt-4 ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
