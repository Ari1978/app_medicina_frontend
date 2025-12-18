"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SESIÓN AUTOMÁTICA POR CONTEXTO
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSession = async () => {
      try {
        const pathname = window.location.pathname;

        let endpoint = null;
        let detectedRole = null;

        if (pathname.startsWith("/empresa")) {
          endpoint = `${API_URL}/api/empresa/me`;
          detectedRole = "empresa";
        } else if (pathname.startsWith("/staff")) {
          endpoint = `${API_URL}/api/staff/auth/me`;
          detectedRole = "staff";
        } else if (pathname.startsWith("/admin")) {
          endpoint = `${API_URL}/api/admin/me`;
          detectedRole = "admin";
        } else if (pathname.startsWith("/superadmin")) {
          endpoint = `${API_URL}/api/superadmin/me`;
          detectedRole = "superadmin";
        }

        if (!endpoint) {
          setUser(null);
          setRole(null);
          return;
        }

        const res = await fetch(endpoint, { credentials: "include" });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setRole(detectedRole);
        } else {
          setUser(null);
          setRole(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // ✅ LOGIN
  const login = async (role, credentials) => {
    const urls = {
      empresa: `${API_URL}/api/empresa/login`,
      staff: `${API_URL}/api/staff/auth/login`,
      admin: `${API_URL}/api/admin/login`,
      superadmin: `${API_URL}/api/superadmin/login`,
    };

    try {
      const res = await fetch(urls[role], {
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

      setUser(data.user ?? data.staff ?? data.empresa ?? data);
      setRole(role);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    const urls = {
      empresa: `${API_URL}/api/empresa/logout`,
      staff: `${API_URL}/api/staff/auth/logout`,
      admin: `${API_URL}/api/admin/logout`,
      superadmin: `${API_URL}/api/superadmin/logout`,
    };

    try {
      if (role) {
        await fetch(urls[role], { method: "POST", credentials: "include" });
      }
    } catch (_) {}

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
        isAdmin: role === "admin",
        isSuperAdmin: role === "superadmin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ HOOK
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
