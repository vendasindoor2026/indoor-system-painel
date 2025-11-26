import { Link } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";

export default function ClientDashboard() {

  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard do Cliente</h1>
      <p>Bem-vindo à sua área exclusiva.</p>
    </ClientLayout>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-green-700 to-emerald-800 text-white shadow-xl p-6 flex flex-col">
        
        <h1 className="text-2xl font-bold mb-10">Área do Cliente</h1>

        <nav className="flex flex-col gap-4 text-lg">
          <Link to="/client" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/client/totens" className="hover:text-gray-300">Totens</Link>
          <Link to="/client/pendentes" className="hover:text-gray-300">Dispositivos Pendentes</Link>
          <Link to="/client/playlists" className="hover:text-gray-300">Playlists</Link>
          <Link to="/client/media" className="hover:text-gray-300">Mídias</Link>
          <Link to="/client/config" className="hover:text-gray-300">Configurações</Link>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full bg-white text-green-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition mt-10"
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
