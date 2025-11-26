import * as React from "react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Erro ao fazer login: " + error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("Erro inesperado.");
      return;
    }

    const role = user.user_metadata?.role;

    if (role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/client";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-900 px-4">

      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-md text-center border border-white/20">
        
        <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
          Bem-vindo ao Sistema
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">

          <div>
            <label className="text-white text-sm ml-1">E-mail</label>
            <input name="email" type="email" placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm ml-1">Senha</label>
            <input name="password" type="password" placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow"
              required
            />
          </div>

          <button type="submit"
            className="mt-2 w-full bg-white text-indigo-700 font-semibold py-3 rounded-lg hover:scale-[1.03] transition shadow-lg disabled:opacity-40"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
