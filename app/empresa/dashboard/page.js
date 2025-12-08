"use client";

import DashboardCard from "../../components/DashboardCard";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function EmpresaDashboard() {
  return (
    <section className="w-full max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
      
      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1 */}
        <DashboardCard title="Solicitar Turno" icon="🩺">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Exámenes preocupacionales y estudios complementarios.
          </p>

          <Link href="/empresa/turnos/nuevo">
            <Button className="w-full bg-blue-700 hover:bg-blue-800 text-sm sm:text-base">
              Nuevo turno
            </Button>
          </Link>

          <Link href="/empresa/turnos">
            <Button
              variant="outline"
              className="w-full mt-2 text-sm sm:text-base"
            >
              Ver mis turnos
            </Button>
          </Link>
        </DashboardCard>

        {/* CARD 2 */}
        <DashboardCard title="Formularios" icon="📄">
          <p className="text-gray-600 mb-3 text-sm sm:text-base">
            Solicitud de visitas, asesoramiento y autorizaciones.
          </p>

          {/* SCROLL SOLO EN MOBILE */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 sm:max-h-none">

            <Link href="/empresa/formulario-visita">
              <Button
                variant="outline"
                className="w-full h-11 rounded-lg border-gray-300 text-gray-700 
                flex items-center justify-start gap-3 px-4 hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <span className="text-lg">🏥</span>
                <span>Visitas domiciliarias</span>
              </Button>
            </Link>

            <Link href="/empresa/formulario-asesoramiento">
              <Button
                variant="outline"
                className="w-full h-11 rounded-lg border-gray-300 text-gray-700 
                flex items-center justify-start gap-3 px-4 hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <span className="text-lg">💬</span>
                <span>Asesoramientos</span>
              </Button>
            </Link>

            <Link href="/empresa/formulario-autorizacion">
              <Button
                variant="outline"
                className="w-full h-11 rounded-lg border-gray-300 text-gray-700 
                flex items-center justify-start gap-3 px-4 hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <span className="text-lg">✍️</span>
                <span>Autorizaciones de atención</span>
              </Button>
            </Link>

            <Link href="/empresa/formulario-presupuesto">
              <Button
                variant="outline"
                className="w-full h-11 rounded-lg border-gray-300 text-gray-700 
                flex items-center justify-start gap-3 px-4 hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <span className="text-lg">💵</span>
                <span>Presupuestos</span>
              </Button>
            </Link>

            <Link href="/empresa/formulario-turno-especial">
              <Button
                variant="outline"
                className="w-full h-11 rounded-lg border-gray-300 text-gray-700 
                flex items-center justify-start gap-3 px-4 hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <span className="text-lg">⭐</span>
                <span>Turnos Especiales</span>
              </Button>
            </Link>

          </div>
        </DashboardCard>

      </div>
    </section>
  );
}
