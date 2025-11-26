import { Link } from "react-router-dom";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-indigo-700 to-purple-800 text-white shadow-xl p-6 flex flex-col">
        
        <h1 className="text-2xl font-bold mb-10">Painel Admin</h1>

        <nav className="flex flex-col gap-4 text-lg">
          <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/admin/clients" className="hover:text-gray-300">Clientes</Link>
          <Link to="/admin/playlists" className="hover:text-gray-300">Playlists</Link>
          <Link to="/admin/media" className="hover:text-gray-300">Mídias</Link>
          <Link to="/admin/devices" className="hover:text-gray-300">Dispositivos</Link>
        </nav>
<nav className="flex flex-col gap-4 text-lg">
  <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
  <Link to="/admin/clients" className="hover:text-gray-300">Clientes</Link>
  <Link to="/admin/playlists" className="hover:text-gray-300">Playlists</Link>
  <Link to="/admin/media" className="hover:text-gray-300">Mídias</Link>
  <Link to="/admin/devices" className="hover:text-gray-300">Dispositivos</Link>
<Link to="/admin/admins" className="hover:text-gray-300">Administradores</Link>

  {/* 👇 NOVO MENU AQUI */}
  <Link to="/admin/dispositivos-pendentes" className="hover:text-gray-300">
    Dispositivos Pendentes
  </Link>
</nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full bg-white text-indigo-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition mt-10"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
