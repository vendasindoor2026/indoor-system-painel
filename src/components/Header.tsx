import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="w-full p-4 flex justify-between items-center bg-transparent">

      <Link to="/" className="flex items-center gap-2">
        <img src="/assets/brand/logo.png" className="h-60 drop-shadow-md" />
      </Link>

      <div className="flex items-center gap-6">

        {!user && (
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            Login
          </Link>
        )}

        {user && (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>

    </header>
  );
}