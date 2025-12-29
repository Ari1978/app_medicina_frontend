"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import EmpresaSummary from "../components/EmpresaSumary";
import { TurnoProvider } from "@/app/context/TurnoContext";

export default function EmpresaLayout({ children }) {
  const { user, loading, isEmpresa } = useAuth();
  const router = useRouter();

  // 🔒 Protege la ruta automáticamente
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/empresa-login");
    }
  }, [loading, user]);

  // ⏳ Mientras valida sesión
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-700 font-semibold text-lg">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // ❌ Si no es empresa (redirecciona arriba, pero evita errores de render)
  if (!isEmpresa) return null;

  return (
    <TurnoProvider>
      <main className="bg-linear-to-br from-blue-50 to-blue-100 h-screen overflow-y-auto p-4 sm:p-6">

        {/* 🧾 Resumen sólo si hay empresa */}
        {user && (
          <div className="max-w-6xl mx-auto mb-6">
            <EmpresaSummary empresa={user} />
          </div>
        )}

        {/* 📌 Contenido interno */}
        <div className="max-w-6xl mx-auto pb-20">{children}</div>
      </main>
    </TurnoProvider>
  );
}
