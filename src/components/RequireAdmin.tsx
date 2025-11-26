import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      const role = data.user?.user_metadata?.role;

      if (role === "admin") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    }
    check();
  }, []);

  if (allowed === null) return <p>Carregando...</p>;

  if (allowed === false) return <Navigate to="/login" replace />;

  return children;
}
