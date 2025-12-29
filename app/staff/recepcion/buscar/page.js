"use client";

import { useEffect, useState } from "react";

// =========================
// ENV
// =========================
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}
const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// =========================
// HELPERS
// =========================
const hoyISO = () => new Date().toISOString().split("T")[0];

// =========================
// COMPONENTE PRINCIPAL
// =========================
export default function GestionTurnosEmpleados() {
  const [filtros, setFiltros] = useState({
    fecha: hoyISO(),
    empresaId: "",
    empresaNombre: "",
    dni: "",
  });

  const [sugerenciasEmpresas, setSugerenciasEmpresas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editar, setEditar] = useState(null);

  // paginación
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  // =========================
  // AUTOCOMPLETE EMPRESA
  // =========================
  useEffect(() => {
    if (filtros.empresaNombre.length < 2) {
      setSugerenciasEmpresas([]);
      return;
    }

    const controller = new AbortController();

    const buscarEmpresa = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/empresa/buscar?query=${encodeURIComponent(
            filtros.empresaNombre
          )}`,
          { credentials: "include", signal: controller.signal }
        );

        if (!res.ok) throw new Error();
        const data = await res.json();
        setSugerenciasEmpresas(Array.isArray(data) ? data : []);
      } catch {}
    };

    buscarEmpresa();
    return () => controller.abort();
  }, [filtros.empresaNombre]);

  // =========================
  // BUSCAR TURNOS
  // =========================
  const buscar = async (p = 1) => {
    setLoading(true);
    setPage(p);

    try {
      const params = new URLSearchParams({
        fecha: filtros.fecha,
        page: p,
        limit,
      });

      if (filtros.empresaId) params.append("empresaId", filtros.empresaId);
      if (filtros.dni) params.append("dni", filtros.dni);

      const res = await fetch(
        `${API_URL}/api/staff/recepcion/turnos?${params}`,
        { credentials: "include", cache: "no-store" }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (Array.isArray(data)) {
        setTurnos(data);
        setTotal(data.length);
      } else {
        setTurnos([]);
        setTotal(0);
      }
    } catch {
      setTurnos([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscar(1);
  }, []);

  const totalPages = Math.ceil(total / limit);

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Gestión diaria de turnos y empleados
      </h1>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-semibold">Fecha</label>
          <input
            type="date"
            value={filtros.fecha}
            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="relative">
          <label className="text-sm font-semibold">Empresa</label>
          <input
            value={filtros.empresaNombre}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                empresaNombre: e.target.value,
                empresaId: "",
              })
            }
            className="border rounded px-3 py-2"
            placeholder="Buscar empresa…"
          />

          {sugerenciasEmpresas.length > 0 && (
            <div className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
              {sugerenciasEmpresas.map((e) => (
                <div
                  key={e._id}
                  onClick={() => {
                    setFiltros({
                      ...filtros,
                      empresaId: e._id,
                      empresaNombre: e.razonSocial,
                    });
                    setSugerenciasEmpresas([]);
                  }}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                >
                  {e.razonSocial}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">DNI</label>
          <input
            value={filtros.dni}
            onChange={(e) => setFiltros({ ...filtros, dni: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={() => buscar(1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Buscar
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3">Apellido y Nombre</th>
              <th className="px-4 py-3">DNI</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t) => {
              const esEmpleado = Boolean(t.empleado?._id);

              return (
                <tr key={t._id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">{t.hora}</td>
                  <td className="px-4 py-3 font-medium">
                    {esEmpleado
                      ? `${t.empleado.apellido} ${t.empleado.nombre}`
                      : `${t.empleadoApellido} ${t.empleadoNombre}`}
                  </td>
                  <td className="px-4 py-3">
                    {esEmpleado ? t.empleado.dni : t.empleadoDni}
                  </td>
                  <td className="px-4 py-3">{t.empresa?.razonSocial || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        esEmpleado
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {esEmpleado ? "Empleado" : "Postulante"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      onClick={() => setEditar(t)}
                      className="border px-3 py-1 rounded"
                    >
                      Editar
                    </button>

                    {!esEmpleado && (
                      <button
                        onClick={() => darAltaComoPaciente(t)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Dar de alta
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && turnos.length === 0 && (
          <p className="p-4 text-center text-gray-500">No hay resultados</p>
        )}

        {loading && <p className="p-4 text-center text-gray-500">Cargando…</p>}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => buscar(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ←
          </button>

          <span className="px-3 py-1">
            Página {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => buscar(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}

      {/* MODAL */}
      {editar && (
        <EditarPersonaModal
          turno={editar}
          onClose={() => setEditar(null)}
          onSaved={() => buscar(page)}
        />
      )}
    </div>
  );
}

// =========================
// ALTA POSTULANTE → PACIENTE
// =========================
async function darAltaComoPaciente(turno) {
  if (!confirm("¿Dar de alta este postulante como paciente?")) return;

  const res = await fetch(
    `${API_URL}/api/staff/pacientes/alta-desde-turno/${turno._id}`,
    { method: "POST", credentials: "include" }
  );

  if (!res.ok) {
    alert("Error al dar de alta");
    return;
  }

  alert("Paciente dado de alta correctamente");
}

// =========================
// MODAL EDICIÓN
// =========================
function EditarPersonaModal({ turno, onClose, onSaved }) {
  const esEmpleado = Boolean(turno.empleado?._id);

  const [form, setForm] = useState(
    esEmpleado
      ? { ...turno.empleado }
      : {
          empleadoNombre: turno.empleadoNombre,
          empleadoApellido: turno.empleadoApellido,
          empleadoDni: turno.empleadoDni,
        }
  );

  const guardar = async () => {
  const url = esEmpleado
    ? `${API_URL}/api/staff/pacientes/${turno.empleado._id}`
    : `${API_URL}/api/staff/recepcion/turnos/${turno._id}/datos-postulante`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Error al guardar");
    return;
  }

  onSaved();
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Editar {esEmpleado ? "Empleado" : "Postulante"}
        </h2>

        <div className="space-y-3">
          <input
            value={form.apellido || form.empleadoApellido}
            onChange={(e) =>
              setForm({
                ...form,
                apellido: e.target.value,
                empleadoApellido: e.target.value,
              })
            }
            placeholder="Apellido"
            className="border rounded px-3 py-2 w-full"
          />

          <input
            value={form.nombre || form.empleadoNombre}
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value,
                empleadoNombre: e.target.value,
              })
            }
            placeholder="Nombre"
            className="border rounded px-3 py-2 w-full"
          />

          <input
            value={form.dni || form.empleadoDni}
            onChange={(e) =>
              setForm({
                ...form,
                dni: e.target.value,
                empleadoDni: e.target.value,
              })
            }
            placeholder="DNI"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={guardar}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
