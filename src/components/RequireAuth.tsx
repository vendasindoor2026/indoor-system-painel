import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RequireAuth({ role, children }: any) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function verify() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const userRole = user.user_metadata?.role;

      // SEM ROLE → bloqueia sempre
      if (!userRole) {
        window.location.href = "/login";
        return;
      }

      // ADMIN acessa admin
      if (role === "admin" && userRole === "admin") {
        setAllowed(true);
      }
      // CLIENT acessa client
      else if (role === "client" && userRole === "client") {
        setAllowed(true);
      }
      // NÃO TEM PERMISSÃO
      else {
        window.location.href = "/login";
        return;
      }

      setChecking(false);
    }

    verify();
  }, []);

  if (checking) {
    return (
      <div className="text-center mt-10 text-white text-xl animate-pulse">
        Verificando acesso...
      </div>
    );
  }

  return allowed ? children : null;
}
