"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

function formatear(fechaIso) {
  const d = new Date(fechaIso);
  return d.toLocaleString();
}

function etiqueta(evento) {
  switch (evento) {
    case "SUBE_ADJUNTO":
      return "Archivo cargado";
    case "GUARDA_PREINFORME":
      return "Pre-informe actualizado";
    case "CIERRA_INFORME":
      return "Informe cerrado";
    default:
      return evento;
  }
}

export default function TimelineAuditoria({ turnoId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!turnoId) return;

    fetch(`${API_URL}/api/auditoria/turno/${turnoId}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .finally(() => setLoading(false));
  }, [turnoId]);

  if (loading) return <p className="text-sm text-gray-400">Cargando actividad…</p>;
  if (!items.length) return <p className="text-sm text-gray-400">Sin actividad</p>;

  return (
    <div className="border rounded p-4 bg-white space-y-3">
      <h3 className="font-medium">Actividad</h3>

      <ul className="space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="text-sm">
            <span className="text-gray-500">{formatear(i.fecha)}</span>
            <span className="mx-2">—</span>
            <span>{etiqueta(i.evento)}</span>
            {i.rol && (
              <span className="ml-2 text-gray-400">({i.rol})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
