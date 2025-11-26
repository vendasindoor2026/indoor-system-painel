import * as React from "react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    // LOGIN NO SUPABASE
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    const user = data.user;

    // Proteção: ROLE obrigatória
    const role = user.user_metadata?.role;

    if (!role) {
      setError("Usuário sem permissão. Fale com o administrador.");
      setLoading(false);
      return;
    }

    // Redirecionamentos
    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "client") {
      window.location.href = "/client";
    } else {
      setError("Tipo de conta inválido.");
    }

    setLoading(false);
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
            <input
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm ml-1">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow"
              required
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-white text-indigo-700 font-semibold py-3 rounded-lg hover:scale-[1.03] transition shadow-lg disabled:opacity-40"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <div className="mt-6 text-white/80 text-sm">
          <a href="/forgot-password" className="hover:underline">
            Esqueci minha senha
          </a>
        </div>

      </div>

    </div>
  );
}
