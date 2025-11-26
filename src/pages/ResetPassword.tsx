import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function updatePass(e: any) {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMsg("Erro: " + error.message);
    else setMsg("Senha alterada com sucesso! Faça login novamente.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-700 text-white">
      <form className="bg-white/10 p-6 rounded-lg w-80" onSubmit={updatePass}>
        <h2 className="text-xl font-bold mb-4">Definir Nova Senha</h2>

        <input
          type="password"
          placeholder="Nova senha"
          className="w-full p-2 rounded bg-white/20 mb-3"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="w-full bg-white text-indigo-700 py-2 rounded font-semibold">
          Atualizar senha
        </button>

        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
