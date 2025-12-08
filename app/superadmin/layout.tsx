"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:4000/api/superadmin/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) router.push("/");
        return res.json();
      })
      .then((data) => {
        if (data.role !== "superadmin") router.push("/");
      })
      .catch(() => router.push("/"));
  }, [router]);

  // ✅ LOGOUT DIRECTO (SIN CONTEXTO)
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/superadmin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {}

    router.push("/"); // vuelve al inicio
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">SuperAdmin</h2>

        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/superadmin/dashboard" className="hover:bg-gray-800 p-2 rounded">
            Dashboard
          </Link>

          <Link href="/superadmin/empresas" className="hover:bg-gray-800 p-2 rounded">
            Empresas
          </Link>

          <Link href="/superadmin/admins" className="hover:bg-gray-800 p-2 rounded">
            Admins
          </Link>

          <Link href="/superadmin/staff" className="hover:bg-gray-800 p-2 rounded">
            Staff
          </Link>

          <Link href="/superadmin/geo" className="hover:bg-gray-800 p-2 rounded">
            Geolocalización
          </Link>

          <Link href="/superadmin/sedes" className="hover:bg-gray-800 p-2 rounded">
            Sedes de atención
          </Link>

          <Link href="/superadmin/perfiles" className="hover:bg-gray-800 p-2 rounded">
            Perfiles de exámenes
          </Link>

          <Link
            href="/superadmin/importar-empresas"
            className="hover:bg-gray-800 p-2 rounded"
          >
            Importar empresas
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
