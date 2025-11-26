import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ClientLayout from "../components/ClientLayout";

export default function ClientConfig() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    // Buscar client_id
    const { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (client) {
      setClientData(client);
      setCompanyName(client.company_name || "");
      setContactEmail(client.contact?.email || "");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveChanges() {
    if (!clientData) return;

    setSaving(true);

    const { error } = await supabase
      .from("clients")
      .update({
        company_name: companyName,
        contact: { email: contactEmail },
      })
      .eq("id", clientData.id);

    setSaving(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    alert("Configurações atualizadas com sucesso!");
  }

  return (
    <ClientLayout>
      <h1 className="text-2xl font-bold mb-6">Configurações da Conta</h1>

      {loading && <p className="text-gray-600">Carregando…</p>}

      {!loading && clientData && (
        <div className="bg-white p-6 rounded-lg shadow border max-w-xl">

          <div className="mb-4">
            <label className="font-semibold">Nome da Empresa</label>
            <input
              type="text"
              className="mt-1 w-full border p-2 rounded"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">E-mail de Contato</label>
            <input
              type="email"
              className="mt-1 w-full border p-2 rounded"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          {/* botão de salvar */}
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Salvando…" : "Salvar Alterações"}
          </button>
        </div>
      )}
    </ClientLayout>
  );
}
