"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";

function SuperAdminLayoutContent({ children }) {
  const { loading, isSuperAdmin, logout } = useAuth();
  const router = useRouter();

  // 🔐 PROTECCIÓN REAL
  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      router.replace("/");
    }
  }, [loading, isSuperAdmin, router]);

  // ⏳ ESPERA SESIÓN
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-semibold">Verificando sesión...</p>
      </div>
    );
  }

  // ❌ BLOQUEO TOTAL SI NO ES SUPERADMIN
  if (!isSuperAdmin) return null;

  // ✅ LOGOUT LIMPIO + BLOQUEO FLECHA ATRÁS
  const handleLogout = async () => {
    await logout();
    router.replace("/"); // ✅ no permite volver con la flecha
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ✅ SIDEBAR */}
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

          <Link
            href="/superadmin/servicios-users"
            className="hover:bg-gray-800 p-2 rounded"
          >
            Usuarios de Servicios
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

        {/* ✅ CERRAR SESIÓN ABAJO */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white p-2 rounded font-semibold transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* ✅ CONTENIDO */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default function SuperAdminLayout({ children }) {
  return (
    <AuthProvider>
      <SuperAdminLayoutContent>{children}</SuperAdminLayoutContent>
    </AuthProvider>
  );
}
