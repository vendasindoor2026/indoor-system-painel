import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="p-4 shadow flex items-center justify-between bg-white/10 backdrop-blur-md">
      
      {/* Logo pequena */}
      <Link to="/">
        <img
          src="/assets/brand/logo.png"
          alt="Logo"
          className="h-12 w-auto"  // <<< Agora fica pequeno sempre
        />
      </Link>

      {/* Botão Login discreto */}
      <Link
        to="/login"
        className="text-white font-semibold hover:underline"
      >
        Login
      </Link>

    </header>
  );
}
