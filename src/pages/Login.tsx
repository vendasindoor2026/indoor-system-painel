import * as React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-900 px-4">

      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md text-center animate-[fadeIn_0.8s_ease]">
        
        <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
          Acesse sua Conta
        </h1>

        <div className="flex flex-col gap-4 text-left">

          <div>
            <label className="text-white text-sm ml-1">E-mail</label>
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          <div>
            <label className="text-white text-sm ml-1">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          <button className="mt-4 w-full bg-white text-indigo-700 font-semibold py-3 rounded-lg hover:scale-105 transition shadow-lg">
            Entrar
          </button>

        </div>

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
