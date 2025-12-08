"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RecepcionLayout({ children }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API_URL}/staff/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/staff/login");
          return;
        }

        const data = await res.json();

        if (!data.permisos?.includes("recepcion")) {
          router.push("/staff/sin-permisos");
          return;
        }

        setCargando(false);
      } catch {
        router.push("/staff/login");
      }
    }

    check();
  }, [router]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando recepción...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Recepción</h1>

          <button
            onClick={async () => {
              await fetch(`${API_URL}/staff/auth/logout`, {
                method: "POST",
                credentials: "include",
              });

              router.push("/staff/login");
            }}
            className="text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
