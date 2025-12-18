
"use client";

import { useEffect, useState } from "react";

// ✅ SOLO PRODUCCIÓN
const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function MarketingPresupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/marketing/presupuestos`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setPresupuestos)
      .catch(() => setPresupuestos([]));
  }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-700">
        Solicitudes de Presupuesto
      </h2>

      {presupuestos.length === 0 && (
        <p className="text-gray-600 bg-white p-4 rounded shadow">
          No hay presupuestos aún.
        </p>
      )}

      {presupuestos.map((p) => (
        <div
          key={p._id}
          className="bg-white shadow border rounded-xl p-5 space-y-2"
        >
          <div className="flex justify-between">
            <h3 className="font-bold text-lg text-purple-700">
              {p.datos.empleadoApellido} {p.datos.empleadoNombre}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                p.estado === "pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {p.estado}
            </span>
          </div>

          <p><strong>Email:</strong> {p.datos.emailContacto}</p>
          <p><strong>Celular:</strong> {p.datos.celular}</p>
          <p><strong>Servicio:</strong> {p.datos.tipoServicio}</p>
          <p><strong>Urgencia:</strong> {p.datos.urgencia}</p>
          <p><strong>Motivo:</strong> {p.datos.motivo}</p>
          <p><strong>Detalles:</strong> {p.datos.detalles}</p>

          <p className="text-xs text-gray-500">
            Empresa ID: {p.empresa}
          </p>
        </div>
      ))}
    </section>
  );
}
