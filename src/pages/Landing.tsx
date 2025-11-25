export default function Landing() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-gray-800">
        GRUPO INDOOR SMART
      </h1>
      <p className="mt-4 text-xl text-gray-600 max-w-xl">
        Soluções completas para Totens Indoor, Android TV, Smart TV Samsung,
        LG WebOS, Roku e muito mais. Gerencie playlists, mídias e clientes
        com facilidade.
      </p>

      <a
        href="/login"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow hover:bg-blue-700"
      >
        Entrar na Plataforma
      </a>
    </div>
  );
}
