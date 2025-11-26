import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ClientDashboard() {

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (data.user?.user_metadata.role !== "client") {
        window.location.href = "/login";
      }
    }
    check();
  }, []);

  return (
    <h1>Painel do Cliente</h1>
  );
}
