import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (data.user?.user_metadata.role !== "admin") {
        window.location.href = "/login";
      }
    }
    check();
  }, []);

  return (
    <h1>Painel do Administrador</h1>
  );
}
