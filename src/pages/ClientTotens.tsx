import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ClientTotens() {
  const [totens, setTotens] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTotens() {
    setLoading(true);

    // pega o usuário atual
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setTotens([]);
      setLoading(false);
      return;
    }

    // pega o client_id do usuário
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!client) {
      setTotens([]);
      setLoading(false);
      return;
    }

    // pega os totens autorizados do cliente
    const { data, error } = await supabase
      .from("totens")
      .select("*")
      .eq("client_id", client.id)
      .eq("authorized", true)
      .order("created_at", { ascending: false });

    if (!error) {
      setTotens(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTotens();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Totens</h1>

      {loading && <p className="text-gray-500">Carregando...</p>}

      {!loading && totens.length === 0 && (
        <p className="text-gray-500">
          Nenhum toten autorizado encontrado para sua conta.
        </p>
      )}

      {!loading && totens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {totens.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg p-5 shadow bg-white flex flex-col"
            >
              <h2 className="text-lg font-semibold">{t.name || "Totem sem nome"}</h2>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Device ID:</strong> {t.device_id}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Modelo:</strong> {t.model || "—"}
              </p>

              <p className="text-sm mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    t.status === "online"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {t.status === "online" ? "Online" : "Offline"}
                </span>
              </p>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Último contato:</strong>{" "}
                {t.last_seen
                  ? new Date(t.last_seen).toLocaleString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
