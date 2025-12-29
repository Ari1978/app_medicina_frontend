"use client";

import UploadArchivo from "@/app/servicios/components/UploadArchivo";

export default function PsicologiaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Servicio de Psicología</h1>
      <UploadArchivo
        titulo="Subir informe psicológico"
        endpoint="/api/staff/servicios/psicologia"
        accept=".pdf"
      />
    </div>
  );
}
