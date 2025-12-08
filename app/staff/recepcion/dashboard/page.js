"use client";

import Link from "next/link";

export default function DashboardRecepcion() {
  const cards = [
    {
      title: "Turnos del Día",
      desc: "Ver, confirmar e imprimir turnos de exámenes y estudios",
      href: "/staff/recepcion/turnos-hoy",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Pacientes",
      desc: "Alta, búsqueda y autocompletado de pacientes",
      href: "/staff/recepcion/pacientes",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Búsqueda Rápida",
      desc: "Buscar por DNI, nombre o apellido",
      href: "/staff/recepcion/buscar",
      color: "from-violet-500 to-violet-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard de Recepción
        </h2>
        <p className="text-gray-600 mt-1">
          Gestión de pacientes, turnos e impresiones
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl shadow-lg border bg-white hover:shadow-xl transition"
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-90 group-hover:opacity-100 transition`}
            />

            <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-2 text-sm opacity-90">{card.desc}</p>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <span className="text-sm font-semibold group-hover:underline">
                  Abrir →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
