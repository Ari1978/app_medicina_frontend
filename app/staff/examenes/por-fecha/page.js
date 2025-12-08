"use client";

import { useState } from "react";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");


export default function TurnosPorFecha() {
  const [fecha, setFecha] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!fecha) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/staff/examenes/por-fecha/${fecha}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Error al buscar turnos");

      const data = await res.json();
      setTurnos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al buscar turnos:", err);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Turnos por Fecha</h2>

      {/* SELECTOR DE FECHA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={buscar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-2 py-2">Hora</th>
              <th className="border px-2 py-2">Tipo</th>
              <th className="border px-2 py-2">Motivo</th>
              <th className="border px-2 py-2">Empleado</th>
              <th className="border px-2 py-2">DNI</th>
              <th className="border px-2 py-2">Estudios</th>
              <th className="border px-2 py-2">Empresa</th>
              <th className="border px-2 py-2">Estado</th>
              <th className="border px-2 py-2">PDF</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t) => (
              <tr key={t._id} className="text-center hover:bg-gray-50">
                {/* HORA */}
                <td className="border px-2 py-1">{t.hora}</td>

                {/* TIPO */}
                <td className="border px-2 py-1 capitalize">{t.tipo}</td>

                {/* MOTIVO */}
                <td className="border px-2 py-1 capitalize">
                  {t.tipo === "examen"
                    ? t.motivo || "—"
                    : t.motivoEstudio || "—"}
                </td>

                {/* EMPLEADO */}
                <td className="border px-2 py-1">
                  {t.empleadoApellido} {t.empleadoNombre}
                </td>

                {/* DNI */}
                <td className="border px-2 py-1">{t.empleadoDni}</td>

                {/* ✅ ESTUDIOS */}
                <td className="border px-2 py-1 text-left">
                  {Array.isArray(t.listaEstudios) && t.listaEstudios.length > 0
                    ? t.listaEstudios.join(", ")
                    : "—"}
                </td>

                {/* EMPRESA */}
                <td className="border px-2 py-1">
                  {t.empresa?.razonSocial || "—"}
                </td>

                {/* ESTADO */}
                <td className="border px-2 py-1 capitalize">{t.estado}</td>

                {/* PDF */}
                <td className="border px-2 py-1">
                  {t.pdfResultado ? (
                    <a
                      href={t.pdfResultado}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MENSAJES */}
        {!loading && turnos.length === 0 && fecha && (
          <p className="text-center text-gray-500 p-4">
            No hay turnos para esa fecha.
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 p-4">Cargando...</p>
        )}
      </div>
    </div>
  );
}
