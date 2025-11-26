import * as React from "react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  const email = e.target[0].value;
  const password = e.target[1].value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  setLoading(false);

  if (error) {
    alert("❌ Erro ao entrar: " + error.message);
    return;
  }

  alert("✔ Login realizado com sucesso!");
  window.location.href = "/admin"; 
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-900 px-4">

      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-md text-center border border-white/20">

        {/* Título */}
        <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
          Bem-vindo ao Sistema
        </h1>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">

          {/* Email */}
          <div>
            <label className="text-white text-sm ml-1">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="text-white text-sm ml-1">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow"
              required
            />
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            className="mt-2 w-full bg-white text-indigo-700 font-semibold py-3 rounded-lg hover:scale-[1.03] transition shadow-lg disabled:opacity-40"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

        {/* Links */}
        <div className="mt-6 text-white/80 text-sm">
          <a href="#" className="hover:underline">
            Esqueci minha senha
          </a>
        </div>

        <div className="mt-4 text-white/80 text-sm">
          Não tem conta?{" "}
          <a href="/register" className="font-semibold underline">
            Criar conta
          </a>
        </div>

      </div>

    </div>
  );
}
