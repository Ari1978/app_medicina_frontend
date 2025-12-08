"use client";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
console.log("🔥 API_URL COMPILADO:", API_URL);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SESIÓN AUTOMÁTICA (PRODUCCIÓN)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSession = async () => {
      try {
        const endpoints = [
          { url: `${API_URL}/api/empresa/me`, role: "empresa" },
          { url: `${API_URL}/api/staff/auth/me`, role: "staff" },
          { url: `${API_URL}/api/admin/auth/me`, role: "admin" },
          { url: `${API_URL}/api/superadmin/auth/me`, role: "superadmin" },
        ];

        for (const ep of endpoints) {
          try {
            const res = await fetch(ep.url, {
              credentials: "include",
            });

            if (res.ok) {
              const data = await res.json();
              setUser(data);
              setRole(ep.role);
              return;
            }
          } catch (_) {}
        }

        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // ✅ LOGIN UNIFICADO
  const login = async (role, credentials) => {
    const urls = {
      empresa: `${API_URL}/api/empresa/login`,
      staff: `${API_URL}/api/staff/auth/login`,
      admin: `${API_URL}/api/admin/auth/login`,
      superadmin: `${API_URL}/api/superadmin/auth/login`,
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

      // ✅ PRIMER ACCESO EMPRESA
      if (data.mustChangePassword) {
        return {
          ok: true,
          mustChangePassword: true,
          empresaId: data.empresaId,
        };
      }

      // ✅ LOGIN NORMAL
      setUser(data.user ?? data.empresa ?? data);
      setRole(role);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  // ✅ LOGOUT UNIFICADO
  const logout = async () => {
    const urls = {
      empresa: `${API_URL}/api/empresa/logout`,
      staff: `${API_URL}/api/staff/auth/logout`,
      admin: `${API_URL}/api/admin/auth/logout`,
      superadmin: `${API_URL}/api/superadmin/auth/logout`,
    };

    try {
      if (role) {
        await fetch(urls[role], {
          method: "POST",
          credentials: "include",
        });
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
