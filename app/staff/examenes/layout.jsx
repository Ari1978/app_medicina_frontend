"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExamenesLayout({ children }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch(
          "http://localhost:4000/api/staff/auth/me",
          { credentials: "include" }
        );

        if (!res.ok) {
          router.push("/staff/login");
          return;
        }

        const data = await res.json();

        if (!data.permisos?.includes("examenes")) {
          router.push("/staff/sin-permisos");
          return;
        }

        setStaff(data);
      } catch (err) {
        router.push("/staff/login");
      }

      setCargando(false);
    }

    fetchStaff();
  }, [router]);

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 text-gray-600">
        <div className="animate-pulse text-lg font-semibold">
          Cargando panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Panel Staff - Exámenes
            </h1>
            <p className="text-sm text-gray-500">
              Gestión médica y carga de resultados
            </p>
          </div>

          <button
            onClick={async () => {
              await fetch("http://localhost:4000/api/staff/auth/logout", {
                method: "POST",
                credentials: "include",
              });
              router.push("/staff-login");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
