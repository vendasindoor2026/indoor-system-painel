import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function sendEmail(e: any) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://indoor-system-painel.vercel.app/reset-password"
    });

    if (error) setMsg("Erro ao enviar e-mail: " + error.message);
    else setMsg("E-mail enviado! Verifique sua caixa de entrada 📩");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-700 text-white">
      <form className="bg-white/10 p-6 rounded-lg w-80" onSubmit={sendEmail}>
        <h2 className="text-xl font-bold mb-4">Recuperar Senha</h2>

        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full p-2 rounded bg-white/20 mb-3"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button className="w-full bg-white text-indigo-700 py-2 rounded font-semibold">
          Enviar link
        </button>

        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
