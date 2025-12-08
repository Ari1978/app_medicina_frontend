"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function getDisponibilidad(fecha) {
  const url = `${API_URL}/api/empresa/disponibilidad?fecha=${encodeURIComponent(
    fecha
  )}`;

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

export default function CambiarPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaId = searchParams.get("empresaId");

  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!empresaId) {
      router.push("/empresa-login");
    }
  }, [empresaId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (password !== repetirPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/empresa/cambiar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          empresaId,
          password,
          repetirPassword, // ✅ ESTA ERA LA QUE FALTABA
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al cambiar la contraseña");
        setLoading(false);
        return;
      }

      setOk(true);

      setTimeout(() => {
        router.push("/empresa-login");
      }, 2000);
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4">
    <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl border">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Cambio de contraseña
        </CardTitle>
        <p className="text-sm text-gray-500 text-center mt-1">
          Definí tu nueva contraseña para continuar
        </p>
      </CardHeader>

      <CardContent>
        {ok ? (
          <div className="bg-green-100 text-green-700 text-sm p-4 rounded-lg text-center font-semibold">
            Contraseña actualizada correctamente.  
            Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-700">
                Nueva contraseña
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-700">
                Repetir contraseña
              </Label>
              <Input
                type="password"
                value={repetirPassword}
                onChange={(e) => setRepetirPassword(e.target.value)}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-semibold">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-bold bg-linear-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 transition shadow-lg"
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  </div>
);

}
