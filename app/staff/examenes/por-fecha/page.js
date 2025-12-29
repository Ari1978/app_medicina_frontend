"use client";

import { useEffect, useState } from "react";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

function capitalizar(txt = "") {
  return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : "—";
}

export default function TurnosPorFecha() {
  const [fecha, setFecha] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [catalogo, setCatalogo] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [practicasEditadas, setPracticasEditadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // =========================
  // CARGAR CATÁLOGO
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/practicas/catalogo`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        data.forEach((p) => {
          map[p.codigo] = p.nombre;
        });
        setCatalogo(map);
      });
  }, []);

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
      const data = await res.json();
      setTurnos(Array.isArray(data) ? data : []);
    } catch {
      if (!silencioso) setTurnos([]);
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  useEffect(() => {
    if (!fecha) return;
    buscar(true);
    const i = setInterval(() => buscar(true), 8000);
    return () => clearInterval(i);
  }, [fecha]);

  // =========================
  // GUARDAR PRACTICAS
  // =========================
  const guardarPracticas = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/staff/turnos/${id}/practicas`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            listaPracticas: practicasEditadas,
          }),
        }
      );

      if (!res.ok) throw new Error();

      setEditandoId(null);
      setPracticasEditadas([]);
      setBusqueda("");
      buscar(true);
    } catch {
      alert("No se pudieron actualizar las prácticas");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Turnos por Fecha</h2>

      {/* FILTRO */}
      <div className="flex gap-3">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={() => buscar(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2">Hora</th>
              <th className="px-4 py-2">Empleado</th>
              <th className="px-4 py-2">DNI</th>
              <th className="px-4 py-2">Puesto</th>
              <th className="px-4 py-2">Empresa</th>
              <th className="px-4 py-2">Motivo</th>
              <th className="px-4 py-2">Prácticas</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t) => {
              const editable = t.estado !== "realizado";

              return (
                <tr key={t._id} className="border-t align-top">
                  <td className="px-4 py-2">{t.hora}</td>

                  <td className="px-4 py-2">
                    {t.empleadoApellido} {t.empleadoNombre}
                  </td>

                  <td className="px-4 py-2">{t.empleadoDni}</td>
                  <td className="px-4 py-2">{t.puesto}</td>

                  {/* EMPRESA */}
                  <td className="px-4 py-2">
                    {t.empresa?.razonSocial || "—"}
                  </td>

                  {/* MOTIVO */}
                  <td className="px-4 py-2">
                    {capitalizar(t.motivo)}
                  </td>

                  {/* PRACTICAS */}
                  <td className="px-4 py-2">
                    {editandoId === t._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Buscar práctica..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-xs"
                        />

                        {practicasEditadas.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {practicasEditadas.map((codigo) => (
                              <span
                                key={codigo}
                                className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs"
                              >
                                {catalogo[codigo]} ({codigo})
                                <button
                                  onClick={() =>
                                    setPracticasEditadas((prev) =>
                                      prev.filter((c) => c !== codigo)
                                    )
                                  }
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="max-h-64 overflow-y-auto border rounded p-2 space-y-1">
                          {Object.entries(catalogo)
                            .filter(([codigo, nombre]) =>
                              codigo.includes(busqueda) ||
                              nombre
                                .toLowerCase()
                                .includes(busqueda.toLowerCase())
                            )
                            .map(([codigo, nombre]) => (
                              <label
                                key={codigo}
                                className="flex items-center gap-2 text-xs hover:bg-slate-50 px-2 py-1 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={practicasEditadas.includes(codigo)}
                                  onChange={(e) => {
                                    setPracticasEditadas((prev) =>
                                      e.target.checked
                                        ? [...prev, codigo]
                                        : prev.filter((c) => c !== codigo)
                                    );
                                  }}
                                />
                                {nombre} ({codigo})
                              </label>
                            ))}
                        </div>

                        <button
                          onClick={() => guardarPracticas(t._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Guardar prácticas
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {t.listaPracticas.map((p) => (
                          <span
                            key={p.codigo}
                            className="px-2 py-1 bg-slate-100 rounded text-xs"
                          >
                            {catalogo[p.codigo]} ({p.codigo})
                          </span>
                        ))}
                        {editable && (
                          <button
                            onClick={() => {
                              setEditandoId(t._id);
                              setPracticasEditadas(
                                t.listaPracticas.map((p) => p.codigo)
                              );
                              setBusqueda("");
                            }}
                            className="text-blue-600 text-xs"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2">{t.estado}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && turnos.length === 0 && fecha && (
          <p className="p-4 text-center text-gray-500">
            No hay turnos para esa fecha
          </p>
        )}

        {loading && (
          <p className="p-4 text-center text-gray-500">Cargando...</p>
        )}
      </div>
    </div>
  );
}
