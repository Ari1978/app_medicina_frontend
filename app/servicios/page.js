import AreasPermitidas from "../components/AreasPermitidas";
import ServicioCard from "../components/ServicioCard";
import ServicioArchivos from "../components/ServicioArchivos";

export default function ServiciosHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Dashboard Servicios
      </h1>

      {/* ÁREAS */}
      <AreasPermitidas />

      {/* CARDS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServicioCard
          titulo="Turnos asignados"
          valor="—"
        />
        <ServicioCard
          titulo="Archivos subidos hoy"
          valor="—"
        />
        <ServicioCard
          titulo="Pendientes"
          valor="—"
        />
      </div>

      {/* LISTADO DE ARCHIVOS / TURNOS */}
      <ServicioArchivos />
    </div>
  );
}
