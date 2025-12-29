"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import HeaderTurno from "../../../components/HeaderTurno";
import PracticaCard from "../../../components/PracticaCard";
import PreInformeEditor from "../../../components/PreInformeEditor";
import CerrarInformePanel from "../../../components/CerrarInformePanel";
import TimelineAuditoria from "../../../components/TimelineAuditoria";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function DetalleTurnoStaff() {
  const params = useParams();
  const turnoId = params.id;

  const [turno, setTurno] = useState(null);
  const [adjuntos, setAdjuntos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("tokenStaff")
      : null;

  const firstPendingRef = useRef(null);

  // ============================
  // CARGAR TURNO + ADJUNTOS
  // ============================
  useEffect(() => {
    if (!turnoId) return;

    async function load() {
      try {
        const [turnoRes, adjRes] = await Promise.all([
          fetch(`${API_URL}/api/staff/turnos/${turnoId}`, {
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
        <p className="text-gray-500">Cargando turno…</p>
      </div>
    );
  }

  if (!turno) {
    return <p className="p-6">Turno no encontrado</p>;
  }

  // ============================
  // ARMAR PRÁCTICAS + ESTADOS
  // ============================
  let pendingAssigned = false;

  const practicas = (turno.listaEstudios || []).map((p) => {
    const archivos = adjuntos.filter(
      (a) => a.codigoPractica === p.codigo
    );

    let estado = "pendiente";
    if (archivos.length > 0) {
      estado = turno.informeCerrado ? "completa" : "evaluacion";
    }

    const isFirstPending =
      estado === "pendiente" && !pendingAssigned;

    if (isFirstPending) pendingAssigned = true;

    return {
      nombre: p.nombre,
      codigo: p.codigo,
      estado,
      adjuntos: archivos,
      isFirstPending,
    };
  });

  const pendientes = practicas.filter(
    (p) => p.estado === "pendiente"
  ).length;

  const puedeCerrar =
    pendientes === 0 &&
    !turno.informeCerrado &&
    Boolean(turno.adjuntoFinalId);

  // ============================
  // SCROLL A LA PRIMERA PENDIENTE
  // ============================
  useEffect(() => {
    if (firstPendingRef.current) {
      firstPendingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [practicas]);

  const estadoTurno = turno.informeCerrado
    ? "finalizado"
    : pendientes === 0
    ? "evaluacion"
    : "pendiente";

  // ============================
  // RENDER FINAL (2 COLUMNAS)
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

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMNA IZQUIERDA */}
          <section className="lg:col-span-8 space-y-6">
            {/* PRACTICAS */}
            <div className="space-y-4">
              {practicas.length === 0 && (
                <p className="text-sm text-gray-500">
                  No hay prácticas asociadas a este turno.
                </p>
              )}

              {practicas.map((p, i) => (
                <div
                  key={i}
                  ref={p.isFirstPending ? firstPendingRef : null}
                >
                  <PracticaCard
                    nombre={p.nombre}
                    codigo={p.codigo}
                    estado={p.estado}
                    adjuntos={p.adjuntos}
                    editable={!turno.informeCerrado}
                    highlight={p.isFirstPending}
                  />
                </div>
              ))}
            </div>

            {/* PRE-INFORME */}
            {!turno.informeCerrado && (
              <PreInformeEditor
                turnoId={turnoId}
                token={token}
              />
            )}

            {/* CIERRE */}
            {puedeCerrar && (
              <CerrarInformePanel
                adjuntoId={turno.adjuntoFinalId}
                token={token}
                onSuccess={() => window.location.reload()}
              />
            )}
          </section>

          {/* COLUMNA DERECHA */}
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
