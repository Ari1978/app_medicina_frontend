"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function ServiciosSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const permisos = user.permisos || [];

  const servicios = [
    { key: "rayos", label: "Rayos" },
    { key: "laboratorio", label: "Laboratorio" },
    { key: "fonoaudiologia", label: "Fonoaudiología" },
    { key: "electrocardiograma", label: "Electrocardiograma" },
    { key: "psicologia", label: "Psicología" },
    { key: "espirometria", label: "Espirometría" },
    { key: "electroencefalograma", label: "Electroencefalograma" },
  ];

  const visibles = servicios.filter((s) =>
    permisos.includes(s.key),
  );

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/staff/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // aunque falle el backend, limpiamos el front
    }

    logout(); // limpia contexto
    router.push("/staff-login");
  };

  return (
    <aside className="w-64 border-r bg-gray-50 p-4 flex flex-col h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-700">ASMEL</h2>
        <p className="text-sm text-gray-500">Servicios médicos</p>
      </div>

      {/* SERVICIOS */}
      <div className="flex-1">
        <p className="text-xs uppercase text-gray-500 mb-2">
          Servicios habilitados
        </p>

        <nav className="space-y-1">
          {visibles.map((s) => {
            const active = pathname.startsWith(
              `/staff/servicios/${s.key}`,
            );

            return (
              <Link
                key={s.key}
                href={`/staff/servicios/${s.key}`}
                className={`block px-3 py-2 rounded transition ${
                  active
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        {visibles.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">
            No tenés servicios asignados
          </p>
        )}
      </div>

      {/* FOOTER */}
      <div className="pt-4 border-t space-y-3">
        <p className="text-xs text-gray-400">
          Usuario:{" "}
          <span className="font-medium text-gray-600">
            {user.username}
          </span>
        </p>

        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50 transition text-sm font-medium"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
