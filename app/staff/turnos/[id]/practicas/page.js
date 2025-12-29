"use client";

import HeaderTurno from "@/components/HeaderTurno";
import EstadoPracticasBar from "@/components/EstadoPracticasBar";
import PracticaCard from "@/components/PracticaCard";

export default function Page() {
  // MOCK por ahora (después lo conectamos al back)
  const practicas = [
    {
      nombre: "RX Tórax",
      codigo: "100",
      estado: "completa",
      adjuntos: [{}],
    },
    {
      nombre: "Electrocardiograma",
      codigo: "210",
      estado: "evaluacion",
      adjuntos: [{}],
      texto: "Ritmo sinusal normal",
    },
    {
      nombre: "Audiometría",
      codigo: "330",
      estado: "pendiente",
      adjuntos: [],
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <HeaderTurno
        postulante="Juan Pérez"
        empresa="ACME S.A."
        fecha="14/09/2025"
        estado="evaluacion"
      />

      <EstadoPracticasBar
        total={3}
        pendientes={1}
        evaluacion={1}
        completas={1}
      />

      <div className="space-y-4">
        {practicas.map((p, i) => (
          <PracticaCard
            key={i}
            nombre={p.nombre}
            codigo={p.codigo}
            estado={p.estado}
            adjuntos={p.adjuntos}
            texto={p.texto}
            editable={p.estado !== "completa"}
          />
        ))}
      </div>
    </div>
  );
}
