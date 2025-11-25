export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center text-center px-6">

      {/* Nome + logo */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/brand/logo.png"
          alt="Logo"
          className="h-28 w-auto drop-shadow"
        />

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
          GRUPO INDOOR SMART
        </h1>
      </div>

      {/* Subtítulo */}
      <p className="mt-6 text-lg md:text-2xl text-gray-600 max-w-2xl">
        Soluções completas para Totens Indoor, Android TV, Smart TV Samsung,
        LG WebOS, Roku e muito mais. Gerencie playlists, mídias e clientes
        com facilidade e desempenho.
      </p>

      {/* Botões */}
      <div className="flex items-center gap-4 mt-10">
        <a
          href="/login"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg shadow transition"
        >
          Entrar na Plataforma
        </a>

        <a
          href="#sobre"
          className="px-8 py-3 border border-gray-400 rounded-lg text-lg hover:bg-gray-200 transition"
        >
          Sobre nós
        </a>
      </div>

      {/* Sessão Sobre */}
      <div id="sobre" className="mt-20 max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          O que é o Indoor Smart?
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Somos uma plataforma profissional criada para empresas que desejam
          exibir propagandas, anúncios e conteúdos dinâmicos em totens e TVs.
          Oferecemos um painel simples, moderno e poderoso para publicar
          conteúdos em segundos nos seus dispositivos.
        </p>
      </div>

      {/* Rodapé */}
      <footer className="mt-20 text-gray-500 text-sm">
        © {new Date().getFullYear()} Grupo Indoor Smart — Todos os direitos reservados.
      </footer>
    </div>
  );
}
