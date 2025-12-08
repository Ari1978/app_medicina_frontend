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

// ✅ API dinámico (LOCAL + FLY)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, ""); // 👈 evita doble slash


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
      router.push("/empresa/login");
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
      const res = await fetch(`${API_URL}/empresa/cambiar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          empresaId,
          password,
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
        router.push("/empresa/login");
      }, 2000);
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-10 min-h-screen bg-linear-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Cambio de contraseña
          </CardTitle>
        </CardHeader>

        <CardContent>
          {ok ? (
            <div className="bg-green-100 text-green-700 text-sm p-4 rounded text-center">
              Contraseña actualizada. Redirigiendo...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nueva contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Repetir contraseña</Label>
                <Input
                  type="password"
                  value={repetirPassword}
                  onChange={(e) => setRepetirPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-100 text-red-600 p-2 rounded text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Guardando..." : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
