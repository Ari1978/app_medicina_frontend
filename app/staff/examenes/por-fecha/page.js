"use client";

import { useEffect, useState } from "react";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function TurnosPorFecha() {
  const [fecha, setFecha] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [estudiosEditados, setEstudiosEditados] = useState("");

  // =========================
  // BUSCAR TURNOS
  // =========================
  const buscar = async (silencioso = false) => {
    if (!fecha) return;

    if (!silencioso) setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/staff/examenes/por-fecha/${fecha}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Error al buscar turnos");

      const data = await res.json();
      setTurnos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      if (!silencioso) setTurnos([]);
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  // =========================
  // AUTO REFRESH
  // =========================
  useEffect(() => {
    if (!fecha) return;

    buscar(true);

    const i = setInterval(() => buscar(true), 8000);
    return () => clearInterval(i);
  }, [fecha]);

  // =========================
  // GUARDAR ESTUDIOS
  // (mientras NO esté realizado)
  // =========================
  const guardarEstudios = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/staff/turnos/${id}/estudios`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            listaEstudios: estudiosEditados
              .split(",")
              .map(e => e.trim())
              .filter(Boolean),
          }),
        }
      );

      if (!res.ok) throw new Error();

      setEditandoId(null);
      setEstudiosEditados("");
      buscar(true);
    } catch {
      alert("No se pudieron actualizar los estudios");
    }
  };

  const badgeEstado = (estado) => {
    if (estado === "provisional")
      return "bg-yellow-100 text-yellow-700";
    if (estado === "confirmado")
      return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Turnos por Fecha
        </h2>
        <p className="text-sm text-gray-500">
          Gestión de estudios (provisional y confirmado).
        </p>
      </div>

      {/* FILTRO */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow-sm"
        />

        <button
          onClick={() => buscar(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Buscar
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600">
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Motivo</th>
              <th className="px-4 py-3">Empleado</th>
              <th className="px-4 py-3">DNI</th>
              <th className="px-4 py-3">Puesto</th>
              <th className="px-4 py-3 text-left">Estudios</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {turnos.map(t => {
              const editable = t.estado !== "realizado";

              return (
                <tr key={t._id} className="hover:bg-blue-50/40">
                  <td className="px-4 py-2">{t.hora}</td>
                  <td className="px-4 py-2 capitalize">{t.tipo}</td>
                  <td className="px-4 py-2 capitalize">
                    {t.motivo || "—"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {t.empleadoApellido} {t.empleadoNombre}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {t.empleadoDni}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {t.puesto || "—"}
                  </td>

                  {/* ESTUDIOS */}
                  <td className="px-4 py-2">
                    {editandoId === t._id ? (
                      <div className="flex gap-2">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={estudiosEditados}
                          onChange={(e) =>
                            setEstudiosEditados(e.target.value)
                          }
                          placeholder="RX, Espiro, Laboratorio"
                        />
                        <button
                          onClick={() => guardarEstudios(t._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 rounded"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {Array.isArray(t.listaEstudios) &&
                          t.listaEstudios.length > 0
                            ? t.listaEstudios.join(", ")
                            : "—"}
                        </span>

                        {editable && (
                          <button
                            onClick={() => {
                              setEditandoId(t._id);
                              setEstudiosEditados(
                                Array.isArray(t.listaEstudios)
                                  ? t.listaEstudios.join(", ")
                                  : ""
                              );
                            }}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {t.empresa?.razonSocial || "—"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeEstado(
                        t.estado
                      )}`}
                    >
                      {t.estado}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center text-xs text-gray-500">
                    {editable ? "Editable" : "Cerrado"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && turnos.length === 0 && fecha && (
          <p className="text-center text-gray-500 p-6">
            No hay turnos para esa fecha.
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 p-6">
            Cargando...
          </p>
        )}
      </div>
    </div>
  );
}
