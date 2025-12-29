"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import ServicioSidebar from "./components/ServiciosSidebar";

function ServiciosLayoutContent({ children }) {
  const { loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "servicios") {
      router.replace("/servicios/login");
    }
  }, [loading, role]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Verificando sesión...
      </div>
    );
  }

  if (role !== "servicios") return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <ServicioSidebar />

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

export default function ServiciosLayout({ children }) {
  return (
    <AuthProvider>
      <ServiciosLayoutContent>
        {children}
      </ServiciosLayoutContent>
    </AuthProvider>
  );
}
