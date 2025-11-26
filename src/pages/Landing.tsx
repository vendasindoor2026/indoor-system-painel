import * as React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-900 text-white flex flex-col items-center px-6">

      {/* Hero */}
      <div className="flex flex-col items-center text-center mt-20 animate-[fadeIn_1s_ease]">
        <img
          src="/assets/brand/logo.png"
          alt="Logo"
          className="h-58 w-auto mb-6 drop-shadow-xl animate-[pop_0.8s_ease]"
        />

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Venha Conosco Nesta Jornada Tecnológica.
        </h1>

        <p className="mt-6 text-lg md:text-2xl max-w-2xl text-indigo-200 leading-relaxed">
          A plataforma mais completa para gerenciamento de Totens Indoor,
          Android TV, Smart TVs Samsung, LG WebOS, Roku e muito mais.
        </p>

        <div className="flex gap-4 mt-10">
          <a
            href="/login"
            className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg text-lg shadow-xl hover:scale-105 transition"
          >
            Entrar
          </a>

          <a
            href="#sobre"
            className="px-8 py-3 border border-white/50 rounded-lg text-lg hover:bg-white/10 transition"
          >
            Saiba Mais
          </a>
        </div>
      </div>

      {/* Sobre */}
      <div id="sobre" className="mt-32 max-w-3xl text-center animate-[fadeIn_1.5s_ease]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow">
          O que é o Indoor Smart?
        </h2>

        <p className="text-indigo-200 text-lg leading-relaxed">
          Somos uma plataforma profissional criada para empresas que desejam exibir
          propagandas dinâmicas, anúncios e conteúdos visuais em totens e TVs.
          Com nosso painel moderno, você gerencia mídias, playlists, clientes
          e dispositivos com a maior facilidade.
        </p>
      </div>

      <footer className="mt-24 mb-10 text-indigo-300 text-sm">
        © {new Date().getFullYear()} Grupo Indoor Smart — Todos os direitos reservados.
      </footer>
    </div>
  );
}
