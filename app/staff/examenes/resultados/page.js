"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function ResultadosStaffPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busco, setBusco] = useState(false);

  // filtros
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");

  // =========================
  // BUSCAR RESULTADOS (BACK REAL)
  // =========================
  const buscar = () => {
    setBusco(true);
    setLoading(true);

    const params = new URLSearchParams();
    if (dni) params.append("dni", dni);
    if (nombre) params.append("nombre", nombre);

    fetch(`${API_URL}/api/staff/resultados?${params.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTurnos(toArray(data)))
      .catch(() => setTurnos([]))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resultados de Exámenes</h1>

      {/* FILTROS */}
      <div className="flex gap-4 max-w-xl">
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Nombre / Apellido"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={buscar}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Buscar
        </button>
      </div>

      {/* ESTADOS */}
      {loading && <p>Cargando...</p>}

      {!loading && busco && turnos.length === 0 && (
        <p className="text-gray-500">No hay resultados para mostrar.</p>
      )}

      {/* LISTADO */}
      {turnos.length > 0 && (
        <div className="grid gap-4">
          {turnos.map((t) => {
            const tieneResultado = !!t.resultadoFinal;

            return (
              <div
                key={t._id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {t.empleadoApellido}, {t.empleadoNombre}
                  </p>

                  <p className="text-sm text-gray-600">
                    DNI {t.empleadoDni} · {t.fecha} {t.hora}
                  </p>

                  <p className="text-sm text-gray-500">
                    Puesto: {t.puesto}
                  </p>

                  {tieneResultado && (
                    <p className="text-sm text-green-600 font-medium">
                      ✔ Informe cargado
                    </p>
                  )}
                </div>

                <Link
                  href={`/staff/examenes/resultados/${t._id}`}
                  className={`px-4 py-2 rounded text-white ${
                    tieneResultado
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {tieneResultado
                    ? "Editar resultado"
                    : "Cargar resultado"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
