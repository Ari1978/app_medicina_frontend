"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import HeaderTurno from "../../../components/HeaderTurno";
import PracticaCard from "../../../components/PracticaCard";
import TimelineAuditoria from "../../../components/TimelineAuditoria";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function DetalleTurnoEmpresa() {
  const params = useParams();
  const turnoId = params.id;

  const [turno, setTurno] = useState(null);
  const [adjuntos, setAdjuntos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // CARGAR TURNO + ADJUNTOS
  // ============================
  useEffect(() => {
    if (!turnoId) return;

    async function load() {
      try {
        const [turnoRes, adjRes] = await Promise.all([
          fetch(`${API_URL}/api/empresa/turnos/${turnoId}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/adjuntos/turno/${turnoId}`, {
            credentials: "include",
          }),
        ]);

        if (!turnoRes.ok) throw new Error("Error al cargar turno");
        if (!adjRes.ok) throw new Error("Error al cargar adjuntos");

        const turnoData = await turnoRes.json();
        const adjuntosData = await adjRes.json();

        setTurno(turnoData);
        setAdjuntos(adjuntosData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [turnoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando informe…</p>
      </div>
    );
  }

  if (!turno) {
    return <p className="p-6">Turno no encontrado</p>;
  }

  // ============================
  // ARMAR PRÁCTICAS + ESTADOS
  // ============================
  const practicas = (turno.listaEstudios || []).map((p) => {
    const archivos = adjuntos.filter(
      (a) => a.codigoPractica === p.codigo
    );

    let estado = "pendiente";
    if (archivos.length > 0) {
      estado = turno.informeCerrado ? "completa" : "evaluacion";
    }

    return {
      nombre: p.nombre,
      codigo: p.codigo,
      estado,
      adjuntos: archivos,
    };
  });

  const estadoTurno = turno.informeCerrado
    ? "finalizado"
    : practicas.some((p) => p.estado === "pendiente")
    ? "pendiente"
    : "evaluacion";

  // ============================
  // RENDER (2 COLUMNAS)
  // ============================
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <HeaderTurno
          postulante={`${turno.empleadoNombre} ${turno.empleadoApellido}`}
          empresa={turno.empresaNombre || "Empresa"}
          fecha={turno.fecha}
          estado={estadoTurno}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* IZQUIERDA: PRÁCTICAS */}
          <section className="lg:col-span-8 space-y-4">
            {practicas.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay prácticas asociadas a este turno.
              </p>
            )}

            {practicas.map((p, i) => (
              <PracticaCard
                key={i}
                nombre={p.nombre}
                codigo={p.codigo}
                estado={p.estado}
                adjuntos={p.adjuntos}
                editable={false}   // 🔒 SOLO LECTURA
              />
            ))}

            {/* DESCARGA PDF FINAL */}
            {turno.adjuntoFinalId && (
              <a
                href={`${API_URL}/empresa/turnos/${turnoId}/pdf-resumen`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Descargar informe PDF
              </a>
            )}
          </section>

          {/* DERECHA: AUDITORÍA */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <TimelineAuditoria turnoId={turnoId} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
