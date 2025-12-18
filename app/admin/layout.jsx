
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/admin/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          router.push("/admin-login");
          throw new Error("No autorizado");
        }
        return res.json();
      })
      .then((data) => {
        if (data.role !== "admin") {
          router.push("/");
        }
      })
      .catch(() => router.push("/admin-login"));
  }, [router]);

  // ✅ LOGOUT BLOQUEADO (SIN VOLVER ATRÁS)
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {}

    window.location.replace("/admin-login"); // ✅ NO deja volver atrás
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Admin ASMEL</h2>

        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin/dashboard" className="hover:bg-gray-800 p-2 rounded">
            📊 Dashboard
          </Link>

          <Link href="/admin/empresas" className="hover:bg-gray-800 p-2 rounded">
            🏭 Empresas
          </Link>

          <Link href="/admin/presupuestos" className="hover:bg-gray-800 p-2 rounded">
            💰 Presupuestos
          </Link>

          <Link href="/admin/formularios" className="hover:bg-gray-800 p-2 rounded">
            📄 Formularios
          </Link>

          <Link href="/admin/reportes" className="hover:bg-gray-800 p-2 rounded">
            📈 Reportes
          </Link>
        </nav>

        {/* ✅ BOTÓN CERRAR SESIÓN */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white p-2 rounded font-semibold transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
