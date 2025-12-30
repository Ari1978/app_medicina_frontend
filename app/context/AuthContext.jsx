"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const AuthContext = createContext(null);

// 🔒 Validación temprana de entorno
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export function AuthProvider({ children }) {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // CHECK SESSION (REACTIVO A LA RUTA)
  // =========================
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);

      try {
        let endpoint = null;
        let detectedRole = null;

        if (
          pathname.startsWith("/empresa") &&
          !pathname.startsWith("/empresa-login")
        ) {
          endpoint = `${API_URL}/api/empresa/me`;
          detectedRole = "empresa";
        } else if (
          pathname.startsWith("/staff") &&
          !pathname.startsWith("/staff-login")
        ) {
          endpoint = `${API_URL}/api/staff/auth/me`;
          detectedRole = "staff";
        } else if (
          pathname.startsWith("/servicios") &&
          !pathname.startsWith("/servicios/login")
        ) {
          endpoint = `${API_URL}/api/servicios/auth/me`;
          detectedRole = "servicios";
        } else if (
          pathname.startsWith("/admin") &&
          !pathname.startsWith("/admin-login")
        ) {
          endpoint = `${API_URL}/api/admin/me`;
          detectedRole = "admin";
        } else if (
          pathname.startsWith("/superadmin") &&
          !pathname.startsWith("/superadmin-login")
        ) {
          endpoint = `${API_URL}/api/superadmin/me`;
          detectedRole = "superadmin";
        }

        // Ruta pública
        if (!endpoint) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        const res = await fetch(endpoint, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
        setRole(detectedRole);
        setLoading(false);
      } catch {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname]); // ⬅️ CLAVE

  // =========================
  // LOGIN
  // =========================
  const login = async (loginRole, credentials) => {
    const urls = {
      empresa: `${API_URL}/api/empresa/login`,
      staff: `${API_URL}/api/staff/auth/login`,
      servicios: `${API_URL}/api/servicios/auth/login`,
      admin: `${API_URL}/api/admin/login`,
      superadmin: `${API_URL}/api/superadmin/login`,
    };

    try {
      const res = await fetch(urls[loginRole], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login inválido");

      if (data.mustChangePassword) {
        return {
          ok: true,
          mustChangePassword: true,
          empresaId: data.empresaId,
        };
      }

      // ⚠️ NO setear role/user acá
      // se recalcula automáticamente al cambiar la ruta

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    const urls = {
      empresa: `${API_URL}/api/empresa/logout`,
      staff: `${API_URL}/api/staff/auth/logout`,
      servicios: `${API_URL}/api/servicios/auth/logout`,
      admin: `${API_URL}/api/admin/logout`,
      superadmin: `${API_URL}/api/superadmin/logout`,
    };

    try {
      if (role && urls[role]) {
        await fetch(urls[role], {
          method: "POST",
          credentials: "include",
        });
      }
    } catch {}

    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,

        isEmpresa: role === "empresa",
        isStaff: role === "staff",
        isServicio: role === "servicios",
        isAdmin: role === "admin",
        isSuperAdmin: role === "superadmin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
