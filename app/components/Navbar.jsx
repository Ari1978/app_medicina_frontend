"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-extrabold text-blue-700 tracking-tight">
          Medicina Laboral
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition">
            Inicio
          </Link>

          <Link href="/servicios" className="hover:text-blue-600 transition">
            Servicios
          </Link>

          <Link href="/contacto" className="hover:text-blue-600 transition">
            Contacto
          </Link>

          {/* BOTÓN DESTACADO */}
          <Link
            href="/empresa-login"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Ingreso Clientes
          </Link>
        </nav>

        {/* BOTÓN MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MENÚ MOBILE PRO */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="bg-white px-6 pb-6 pt-2 shadow-lg">
          <div className="flex flex-col gap-4 font-semibold text-gray-700">
            <Link href="/" onClick={() => setOpen(false)}>
              Inicio
            </Link>

            <Link href="/servicios" onClick={() => setOpen(false)}>
              Servicios
            </Link>

            <Link href="/contacto" onClick={() => setOpen(false)}>
              Contacto
            </Link>

            <Link
              href="/empresa-login"
              onClick={() => setOpen(false)}
              className="bg-blue-700 text-white text-center py-2 rounded-lg shadow"
            >
              Ingreso Clientes
            </Link>

          </div>
        </nav>
      </div>
    </header>
  );
}
