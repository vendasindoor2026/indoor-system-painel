import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between">

      {/* Logo pequena */}
      <Link to="/">
        <img
          src="/assets/brand/logo.png"
          alt="Logo"
          className="h-12 w-auto"
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
