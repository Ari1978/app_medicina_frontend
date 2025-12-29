"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function StaffLoginForm() {
  const router = useRouter();

  // ✅ ESTADO FORM (ESTO FALTABA)
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/staff/auth/login`, {
        method: "POST",
        credentials: "include", // ✅ COOKIE JWT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const permisos = data.staff?.permisos || [];

      // ❌ SIN PERMISOS
      if (!permisos.length) {
        router.push("/staff/sin-permisos");
        return;
      }

      // 🔐 permisos que llevan a SERVICIOS
      const PERMISOS_SERVICIOS = [
        "rayos",
        "laboratorio",
        "fonoaudiologia",
        "electrocardiograma",
        "psicologia",
        "espirometria",
        "electroencefalograma",
      ];

      const tieneServicios = permisos.some((p) =>
        PERMISOS_SERVICIOS.includes(p),
      );

      // 👉 REDIRECCIÓN FINAL
      if (tieneServicios) {
        router.push("/servicios");
      } else {
        router.push("/staff/dashboard");
      }
    } catch (err) {
      setError("Error en el servidor");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* USUARIO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usuario
        </label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese su usuario"
          required
        />
      </div>

      {/* CONTRASEÑA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su contraseña"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-70"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
