
"use client";

import Link from "next/link";

export default function MarketingDashboard() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* PRESUPUESTOS */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-purple-700">
          💰 Presupuestos
        </h2>

        <p className="text-gray-600 text-sm">
          Solicitudes de presupuesto enviadas por empresas.
        </p>

        <Link
          href="/marketing/presupuestos"
          className="block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
        >
          Ver Presupuestos
        </Link>
      </div>

      {/* FUTURO: CAMPAÑAS */}
      <div className="bg-white shadow rounded-xl p-6 opacity-40">
        <h2 className="text-xl font-bold">📢 Campañas</h2>
        <p className="text-gray-500">Próximamente</p>
      </div>

      {/* FUTURO: CLIENTES */}
      <div className="bg-white shadow rounded-xl p-6 opacity-40">
        <h2 className="text-xl font-bold">🏢 Empresas</h2>
        <p className="text-gray-500">Próximamente</p>
      </div>

    </section>
  );
}
