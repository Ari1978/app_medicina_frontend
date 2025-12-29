"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function StaffSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const permisos = Array.isArray(user?.permisos) ? user.permisos : [];

  const cerrarSesion = async () => {
    await logout();

    // ✅ BLOQUEA VOLVER ATRÁS CON LA FLECHA
    window.location.replace("/staff-login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col justify-between">
      {/* ✅ PARTE SUPERIOR */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-6">Staff ASMEL</h2>
        <p className="text-sm text-gray-400 mb-4">Usuario: {user.username}</p>

        {/* ✅ RECEPCIÓN */}
        {permisos.includes("recepcion") && (
          <div className="space-y-2">
            <p className="font-semibold text-blue-400">🧾 Recepción</p>

            <div className="ml-4 space-y-1 text-sm">
              <Link
                href="/staff/recepcion/turnos-hoy"
                className="block hover:text-blue-300"
              >
                🗓️ Turnos del Día
              </Link>

              <Link
                href="/staff/recepcion/pacientes"
                className="block hover:text-blue-300"
              >
                👤 Pacientes
              </Link>

              <Link
                href="/staff/recepcion/buscar"
                className="block hover:text-blue-300"
              >
                📝 Editar datos de empleados
              </Link>
            </div>
          </div>
        )}

        {/* ✅ EXÁMENES */}
        {permisos.includes("examenes") && (
          <div className="space-y-2">
            <p className="font-semibold text-emerald-400">🩺 Exámenes</p>

            <div className="ml-4 space-y-1 text-sm">
              <Link
                href="/staff/examenes/por-fecha"
                className="block hover:text-emerald-300"
              >
                🗓️ Turnos por fecha
              </Link>

              <Link
                href="/staff/examenes/resultados"
                className="block hover:text-emerald-300"
              >
                📄 Cargar Resultados
              </Link>

              <Link
                href="/staff/examenes/resultados"
                className="block hover:text-emerald-300"
              >
                📝 Editar Resultados
              </Link>

              <Link
                href="/staff/examenes/perfiles"
                className="block hover:text-emerald-300"
              >
                👷 Perfiles de Exámenes
              </Link>

              
            </div>
          </div>
        )}

        {/* ✅ TURNOS ESPECIALES */}
        {permisos.includes("turnos") && (
          <div className="space-y-2">
            <p className="font-semibold text-violet-400">
              🚑 Turnos Especiales
            </p>

            <div className="ml-4 space-y-1 text-sm">
              <Link
                href="/staff/turnos/especiales"
                className="block hover:text-violet-300"
              >
                Especiales
              </Link>

              <Link
                href="/staff/turnos/domicilios"
                className="block hover:text-violet-300"
              >
                Domicilios
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ✅ CERRAR SESIÓN ABAJO */}
      <button
        onClick={cerrarSesion}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
