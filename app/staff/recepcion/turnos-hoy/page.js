"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// -----------------------------
// HELPERS
// -----------------------------
function capitalizar(texto = "") {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function humanizarMotivo(turno) {
  const { tipo, motivo } = turno;
  if (!motivo) return "—";

  const mapExamen = {
    ingreso: "Ingreso",
    egreso: "Egreso",
    periodico: "Periódico",
  };

  if (tipo === "examen") return mapExamen[motivo] || capitalizar(motivo);
  return capitalizar(motivo);
}

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

// -----------------------------
// COMPONENTE
// -----------------------------
export default function TurnosPorDia() {
  const [fecha, setFecha] = useState(hoyISO());
  const [turnos, setTurnos] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [loading, setLoading] = useState(false);

  // =============================
  // CARGAR CATÁLOGO DE PRÁCTICAS
  // =============================
  useEffect(() => {
    fetch(`${API_URL}/api/practicas/catalogo`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCatalogo(Array.isArray(data) ? data : []))
      .catch(() => setCatalogo([]));
  }, []);

  const nombrePractica = (codigo) => {
    const p = catalogo.find((x) => String(x.codigo) === String(codigo));
    return p ? p.nombre : `Código ${codigo}`;
  };

  const obtenerPracticas = (turno) => {
    const practicas = Array.isArray(turno.listaPracticas)
      ? turno.listaPracticas
      : [];

    return practicas.map(
      (p) => `${nombrePractica(p.codigo)} (${p.codigo})`
    );
  };

  // =============================
  // CARGAR TURNOS POR FECHA
  // =============================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/staff/recepcion/turnos?fecha=${fecha}`,
          { credentials: "include", cache: "no-store" }
        );

        if (!res.ok) throw new Error("Error cargando turnos");

        const data = await res.json();

        // ✅ FIX: soporta cualquier wrapper del backend
        const lista =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.turnos)
            ? data.turnos
            : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
            ? data.data
            : [];

        setTurnos(lista);
      } catch (err) {
        console.error("Error cargando turnos:", err);
        setTurnos([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [fecha]);

  // =============================
  // CAMBIAR ESTADO
  // =============================
  const cambiarEstado = async (id, estado) => {
    try {
      const res = await fetch(
        `${API_URL}/api/staff/recepcion/turnos/${id}/estado`,
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
      console.error(err);
      alert("No se pudo actualizar el estado del turno");
    }
  };

  const router = useRouter();

  const imprimirTurno = (turno) => {
    const url = `${API_URL}/api/staff/recepcion/turnos/${turno._id}/pdf`;
    window.open(url, "_blank");
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Turnos por Día</h2>
          <p className="text-gray-500 text-sm">
            Recepción y control de prácticas.
          </p>
        </div>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Empleado</th>
              <th className="px-4 py-3 text-left">DNI</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Motivo</th>
              <th className="px-4 py-3 text-left">Prácticas</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t, idx) => {
              const practicas = obtenerPracticas(t);
              const puedeImprimir = t.estado === "confirmado";
              const bloqueado = t.estado === "realizado";

              return (
                <tr
                  key={t._id}
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  }`}
                >
                  <td className="px-4 py-3">{t.hora}</td>

                  <td className="px-4 py-3">
                    <strong>
                      {t.empleadoApellido} {t.empleadoNombre}
                    </strong>
                    <div className="text-xs text-gray-500">
                      {t.puesto || "—"}
                    </div>
                  </td>

                  <td className="px-4 py-3">{t.empleadoDni}</td>
                  <td className="px-4 py-3">
                    {t.empresa?.razonSocial || "—"}
                  </td>

                  <td className="px-4 py-3">{humanizarMotivo(t)}</td>

                  <td className="px-4 py-3">
                    {practicas.length === 0
                      ? "—"
                      : practicas.join(", ")}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold">
                      {capitalizar(t.estado)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => cambiarEstado(t._id, "confirmado")}
                      disabled={bloqueado || t.estado === "confirmado"}
                      className="mr-1 bg-emerald-600 text-white px-2 py-1 rounded text-xs disabled:opacity-40"
                    >
                      Presente
                    </button>

                    <button
                      onClick={() => cambiarEstado(t._id, "ausente")}
                      disabled={bloqueado || t.estado === "ausente"}
                      className="mr-1 bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-40"
                    >
                      Ausente
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        imprimirTurno(t);
                      }}
                      disabled={bloqueado || !puedeImprimir}
                      className="px-2 py-1 text-xs border rounded disabled:opacity-40"
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && turnos.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No hay turnos para esta fecha.
          </p>
        )}

        {loading && (
          <p className="p-4 text-center text-gray-500">Cargando...</p>
        )}
      </div>
    </div>
  );
}
