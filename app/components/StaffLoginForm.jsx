"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getDisponibilidad(fecha) {
  const url = `${API_URL}/empresa/disponibilidad?fecha=${encodeURIComponent(fecha)}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // ✅ SOLO COOKIE, SIN AUTH HEADER
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error al obtener disponibilidad: " + error);
  }

  return res.json();
}


export default function StaffLoginForm() {
  const router = useRouter();

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
      const res = await fetch(`${API_URL}/staff/auth/login`, {
        method: "POST",
        credentials: "include",
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

      // ✅ REDIRECCIÓN POR PERMISOS
      if (permisos.includes("examenes")) {
        router.push("/staff/examenes/dashboard");
      } else if (permisos.includes("estudios")) {
        router.push("/staff/estudios/dashboard");
      } else if (permisos.includes("recepcion")) {
        router.push("/staff/recepcion/dashboard");
      } else {
        router.push("/staff/sin-permisos");
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

      {/* ✅ CONTRASEÑA CON OJITO */}
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
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 pr-10"
            placeholder="Ingrese su contraseña"
            required
          />

          {/* 👁️ OJITO */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-70"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
