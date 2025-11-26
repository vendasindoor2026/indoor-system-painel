import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full p-4 z-50 flex items-center justify-between bg-transparent">
      
      {/* Logo */}
      <Link to="/">
        <img
          src="/assets/brand/logo.png"
          alt="Logo"
          className="h-60 w-auto"
        />
      </Link>

      {/* Link Login */}
      <Link
        to="/login"
        className="text-white font-semibold hover:underline"
      >
        
      </Link>
    </header>
  );
}
