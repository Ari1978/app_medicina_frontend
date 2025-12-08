"use client";

import { useEffect, useState } from "react";
import TurnosList from "../../components/EmpresaTurnosList";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TurnosPage() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/empresa/turnos`, {
      credentials: "include", // ✅ cookies en local y producción
    })
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar turnos");
        return r.json();
      })
      .then((data) => {
        console.log("TURNOS DEL BACK:", data);

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const normalizarFecha = (f) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(f)) return new Date(f);

          if (f.includes("/")) {
            const [d, m, y] = f.split("/");
            return new Date(`${y}-${m}-${d}`);
          }

          return new Date(f);
        };

        const filtrados = data.filter((t) => {
          const fechaTurno = normalizarFecha(t.fecha);
          if (isNaN(fechaTurno)) return false;

          // ✅ Mostrar turnos con fecha >= HOY
          return fechaTurno >= hoy;
        });

        setTurnos(filtrados);
      })
      .catch(() => setTurnos([]));
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-blue-700">Mis turnos</h1>

        <TurnosList turnos={turnos} />
      </div>
    </main>
  );
}
