import { ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Cabeçalho do cliente */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
