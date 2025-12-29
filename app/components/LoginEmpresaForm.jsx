"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

export default function LoginEmpresaForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let res;

    try {
      res = await login("empresa", { cuit, password });
    } catch (err) {
      setError("Error al iniciar sesión");
      setLoading(false);
      return;
    }

    // 🔴 CORTE DURO: si no hay respuesta válida
    if (!res || (!res.ok && !res.mustChangePassword)) {
      setError(res?.message || "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    // ✅ CAMBIO DE PASSWORD OBLIGATORIO
    if (res.mustChangePassword) {
      router.push(
        `/empresa-login/cambiar-password?empresaId=${res.empresaId}`
      );
      return;
    }

    // ✅ LOGIN OK
    router.push("/empresa/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/70 shadow-2xl border border-white/40 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-800 tracking-tight">
            Acceso Empresa
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* CUIT */}
            <div className="space-y-2">
              <Label>CUIT</Label>
              <Input
                type="text"
                placeholder="Ej: 30-12345678-9"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                required
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su clave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/80 backdrop-blur-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md border border-red-300">
                {error}
              </div>
            )}

            {/* BOTÓN */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg shadow-md"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            ¿Problemas para acceder? Contacte a soporte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

