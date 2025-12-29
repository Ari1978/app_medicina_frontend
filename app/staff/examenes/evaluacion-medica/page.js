"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function EvaluacionMedicaPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // CARGAR TURNOS PARA EVALUACIÓN
  // ============================
  useEffect(() => {
    async function load() {
      try {
        setError(null);

        // ✅ ENDPOINT CORRECTO
        const res = await fetch(
          `${API_URL}/api/staff/turnos/evaluacion/medica`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Error al cargar turnos para evaluación");
        }

        const data = await res.json();

        // 🧠 Seguridad extra: solo turnos con prácticas
        const filtrados = Array.isArray(data)
          ? data.filter(
              (t) =>
                Array.isArray(t.listaPracticas) &&
                t.listaPracticas.length > 0
            )
          : [];

        setTurnos(filtrados);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los turnos médicos");
        setTurnos([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ============================
  // ESTADOS DE CARGA
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando evaluaciones…</p>
      </div>
    );
  }

  // ============================
  // RENDER
  // ============================
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-emerald-700">
          🧠 Evaluación médica
        </h1>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {!error && turnos.length === 0 && (
          <p className="text-gray-500">
            No hay turnos médicos pendientes de evaluación.
          </p>
        )}

        {turnos.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Hora</th>
                  <th className="p-3 text-left">Postulante</th>
                  <th className="p-3 text-left">Empresa</th>
                  <th className="p-3 text-left">Prácticas</th>
                  <th className="p-3 text-center">Acción</th>
                </tr>
              </thead>

              <tbody>
                {turnos.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      {t.hora || "—"}
                    </td>

                    <td className="p-3">
                      {t.empleadoNombre} {t.empleadoApellido}
                    </td>

                    <td className="p-3">
                      {t.empresa?.razonSocial ||
                        t.empresaNombre ||
                        "Empresa"}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {t.listaPracticas.map((p) => (
                          <span
                            key={p.codigo}
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {p.codigo}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <Link
                        href={`/staff/turnos/${t._id}`}
                        className="inline-block px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                      >
                        Evaluar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
