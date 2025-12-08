"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ API dinámico (LOCAL + FLY)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, ""); // 👈 evita doble slash


export default function SuperAdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👁️ ojito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/superadmin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // ✅ Login OK → Dashboard SuperAdmin
      router.push("/superadmin/dashboard");
    } catch (err) {
      setError("Error del servidor");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 px-4">
      <form
        onSubmit={login}
        className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Acceso SuperAdmin
        </h1>

        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* ✅ CONTRASEÑA CON OJITO */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 pr-10"
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
