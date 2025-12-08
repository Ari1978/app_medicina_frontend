"use client";

import Link from "next/link";

export default function DashboardExamenes() {
  const cards = [
    {
      title: "Turnos de Exámenes",
      desc: "Ver todos los exámenes por día",
      href: "/staff/examenes/por-fecha",
      icon: "🗓️",
      color: "from-blue-600 to-blue-400",
    },
    {
      title: "Editar Exámenes",
      desc: "Provisionales por empresa",
      href: "/staff/examenes/provisionales/examenes",
      icon: "📝",
      color: "from-indigo-600 to-indigo-400",
    },
    {
      title: "Cargar Resultados",
      desc: "Subir PDFs de pacientes",
      href: "/staff/examenes/provisionales/estudios",
      icon: "📄",
      color: "from-emerald-600 to-emerald-400",
    },
    {
      title: "Perfiles de Exámenes",
      desc: "Gestionar perfiles por empresa",
      href: "/staff/examenes/perfiles",
      icon: "🧬",
      color: "from-purple-600 to-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard de Exámenes
          </h2>
          <p className="text-gray-500 text-sm">
            Gestión general del área médica
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl bg-white shadow hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* FONDO GRADIENTE */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-100 transition`}
            />

            <div className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-xs text-gray-400 group-hover:text-white transition">
                  Acceder →
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white transition mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/90 transition">
                  {card.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
