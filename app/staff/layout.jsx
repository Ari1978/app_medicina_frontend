"use client";

import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import StaffSidebar from "@/app/components/StaffSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function StaffLayoutContent({ children }) {
  const { loading, isStaff } = useAuth();
  const router = useRouter();

  // 🔐 PROTECCIÓN REAL DE LA RUTA
  useEffect(() => {
    if (!loading && !isStaff) {
      router.replace("/staff-login");
    }
  }, [loading, isStaff, router]);

  // ⏳ Bloquea mientras valida sesión
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  // ❌ Evita render si no es staff
  if (!isStaff) return null;

  return (
    <div className="flex min-h-screen">
      {/* ✅ MENÚ LATERAL */}
      <StaffSidebar />

      {/* ✅ CONTENIDO */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}

export default function StaffLayout({ children }) {
  return (
    <AuthProvider>
      <StaffLayoutContent>{children}</StaffLayoutContent>
    </AuthProvider>
  );
}
