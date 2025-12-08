"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/superadmin/stats",
        { credentials: "include" }
      );

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel SuperAdmin</h1>

      {/* ============================ */}
      {/* TARJETAS DE ESTADÍSTICAS */}
      {/* ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Empresas"
          value={stats?.empresasTotal ?? 0}
          description={`${stats?.empresasActivas ?? 0} activas / ${
            stats?.empresasInactivas ?? 0
          } inactivas`}
        />

        <StatCard
          title="Admins"
          value={stats?.admins ?? 0}
          description="Usuarios administradores"
        />

        <StatCard
          title="Staff"
          value={stats?.staff ?? 0}
          description="Usuarios operativos"
        />

        <StatCard
          title="Geolocalización"
          value={stats?.localidades ?? 0}
          description="Localidades cargadas"
        />
      </div>

      {/* ============================ */}
      {/* ACCESOS RÁPIDOS */}
      {/* ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLink
          title="Empresas"
          description="Gestión completa de empresas registradas"
          href="/superadmin/empresas"
        />

        <QuickLink
          title="Usuarios Internos"
          description="Admins y Staff del sistema"
          href="/superadmin/admin"
        />

        <QuickLink
          title="Geolocalización"
          description="Provincias, partidos y localidades"
          href="/superadmin/geo"
        />
      </div>
    </div>
  );
}

// ============================
// COMPONENTES
// ============================

function StatCard({ title, value, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-2">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="text-3xl font-bold text-blue-600">{value}</div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function QuickLink({ title, description, href }) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
    >
      <h2 className="font-bold text-lg">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
