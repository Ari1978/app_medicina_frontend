"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TurnosRecepcion() {
  const [turnos, setTurnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ cargar turnos del día (local + prod)
  useEffect(() => {
    const cargarHoy = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/recepcion/turnos-hoy`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error cargando turnos");

        const data = await res.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando turnos del día:", err);
        setTurnos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarHoy();
  }, []);

  // ✅ buscador (local + prod)
  useEffect(() => {
    if (!busqueda) return;

    const buscar = async () => {
      try {
        const res = await fetch(
          `${API_URL}/recepcion/buscar?query=${encodeURIComponent(busqueda)}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Error en búsqueda");

        const data = await res.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error buscando turnos:", err);
      }
    };

    buscar();
  }, [busqueda]);

  // ✅ confirmar turno (local + prod)
  const confirmar = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/recepcion/turnos/${id}/estado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ estado: "confirmado" }),
        }
      );

      if (!res.ok) throw new Error("Error al confirmar");

      setTurnos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, estado: "confirmado" } : t
        )
      );
    } catch (err) {
      console.error("Error confirmando turno:", err);
      alert("No se pudo confirmar el turno");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Turnos del día</h2>

      <input
        placeholder="Buscar por nombre, apellido o DNI"
        className="border p-2 rounded w-full mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>DNI</th>
              <th>Estudios</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Confirmar</th>
              <th>Imprimir</th>
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

                <td>{t.listaEstudios?.join(", ") || "—"}</td>

                <td>{t.empresa?.razonSocial || "—"}</td>

                <td className="capitalize">{t.estado}</td>

                <td>
                  {t.estado !== "confirmado" && (
                    <button
                      onClick={() => confirmar(t._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Confirmar
                    </button>
                  )}
                </td>

                <td>
                  {t.estado === "confirmado" && (
                    <a
                      href={`${API_URL}/recepcion/turnos/${t._id}/imprimir`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Imprimir
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MENSAJES */}
        {!loading && turnos.length === 0 && (
          <p className="text-center text-gray-500 p-4">
            No hay turnos para mostrar.
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 p-4">Cargando...</p>
        )}
      </div>
    </div>
  );
}
