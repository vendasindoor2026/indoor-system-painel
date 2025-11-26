import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Quando o usuário clicar no link do e-mail, o supabase já autentica automaticamente
    // Nada precisa ser feito aqui
  }, []);

  async function handleReset(e: any) {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Erro ao redefinir senha: " + error.message);
    } else {
      alert("Senha redefinida com sucesso!");
      window.location.href = "/login";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-900">
      <form
        onSubmit={handleReset}
        className="bg-white/10 p-8 rounded-xl backdrop-blur-md shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl text-white font-bold mb-6">Criar nova senha</h1>

        <input
          type="password"
          placeholder="Nova senha"
          className="w-full px-4 py-3 rounded-lg mb-4 bg-white/20 border border-white/30 text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-white text-indigo-700 py-3 rounded-lg font-semibold hover:scale-105 transition"
          type="submit"
        >
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
