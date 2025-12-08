"use client";

import { useEffect, useState } from "react";
import EmpresaSummary from "../components/EmpresaSumary";
import { TurnoProvider } from "@/app/context/TurnoContext";

export default function EmpresaLayout({ children }) {
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/empresa/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setEmpresa(data))
      .catch(() => setEmpresa(null));
  }, []);

  return (
    <TurnoProvider>
      <main className="bg-linear-to-br from-blue-50 to-blue-100 h-screen overflow-y-auto p-4 sm:p-6">

        {/* ✅ BOTÓN RESPONSIVE QUE YA NO TAPA EL TÍTULO */}
        <button
          onClick={async () => {
            try {
              await fetch("http://localhost:4000/api/empresa/logout", {
                method: "POST",
                credentials: "include",
              });

              window.location.href = "/empresa-login";
            } catch (err) {
              console.error("Error al cerrar sesión", err);
            }
          }}
          className="
            fixed sm:absolute
            top-2 sm:top-4
            right-2 sm:right-4
            bg-red-600 hover:bg-red-700 text-white
            px-3 py-1 sm:px-4 sm:py-2
            rounded-lg font-semibold shadow z-50
            text-sm
          "
        >
          Cerrar sesión
        </button>

        {empresa && (
          <div className="max-w-6xl mx-auto mb-6">
            <EmpresaSummary empresa={empresa} />
          </div>
        )}

        <div className="max-w-6xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </TurnoProvider>
  );
}
