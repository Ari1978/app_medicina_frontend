"use client";

import UploadArchivo from "@/app/servicios/components/UploadArchivo";

export default function LaboratorioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Servicio de Laboratorio</h1>
      <UploadArchivo
        titulo="Subir estudio de Laboratorio"
        endpoint="/api/staff/servicios/laboratorio"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}
