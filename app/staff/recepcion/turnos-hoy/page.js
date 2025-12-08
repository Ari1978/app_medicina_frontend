"use client";

import { useEffect, useState } from "react";

export default function TurnosHoy() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/recepcion/turnos-hoy", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setTurnos(Array.isArray(d) ? d : []));
  }, []);

  const cambiarEstado = async (id, estado) => {
    await fetch(`http://localhost:4000/api/recepcion/turnos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ estado }),
    });

    setTurnos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, estado } : t))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Turnos del Día</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th>Hora</th>
              <th>Empleado</th>
              <th>DNI</th>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t) => (
              <tr key={t._id} className="text-center border-t">
                <td>{t.hora}</td>
                <td>{t.empleadoApellido} {t.empleadoNombre}</td>
                <td>{t.empleadoDni}</td>
                <td>{t.empresa?.razonSocial}</td>
                <td>{t.tipo}</td>

                <td className="capitalize font-semibold">
                  {t.estado}
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => cambiarEstado(t._id, "confirmado")}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Llegó
                  </button>

                  <button
                    onClick={() => cambiarEstado(t._id, "ausente")}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Ausente
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
