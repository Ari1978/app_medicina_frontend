"use client";

import { useEffect, useState } from "react";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");


export default function TurnosHoy() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Cargar turnos del día (local + prod)
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/recepcion/turnos-hoy`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error cargando turnos");

        const data = await res.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando turnos:", err);
        setTurnos([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // ✅ Cambiar estado (local + prod)
  const cambiarEstado = async (id, estado) => {
    try {
      const res = await fetch(
        `${API_URL}/apirecepcion/turnos/${id}/estado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ estado }),
        }
      );

      if (!res.ok) throw new Error("Error actualizando estado");

      setTurnos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, estado } : t))
      );
    } catch (err) {
      console.error("Error cambiando estado:", err);
      alert("No se pudo actualizar el estado del turno");
    }
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

                <td>
                  {t.empleadoApellido} {t.empleadoNombre}
                </td>

                <td>{t.empleadoDni}</td>

                <td>{t.empresa?.razonSocial || "—"}</td>

                <td className="capitalize">{t.tipo}</td>

                <td className="capitalize font-semibold">
                  {t.estado}
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => cambiarEstado(t._id, "confirmado")}
                    disabled={t.estado === "confirmado"}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-2 py-1 rounded text-xs"
                  >
                    Llegó
                  </button>

                  <button
                    onClick={() => cambiarEstado(t._id, "ausente")}
                    disabled={t.estado === "ausente"}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-2 py-1 rounded text-xs"
                  >
                    Ausente
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MENSAJES */}
        {!loading && turnos.length === 0 && (
          <p className="text-center text-gray-500 p-4">
            No hay turnos para hoy.
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 p-4">Cargando...</p>
        )}
      </div>
    </div>
  );
}
