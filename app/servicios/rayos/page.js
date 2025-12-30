"use client";

import UploadArchivo from "@/app/components/UploadArchivo";

export default function RayosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Servicio de Rayos</h1>
      <p className="text-gray-600">
        Subí estudios radiológicos asociados a un turno.
      </p>

      <UploadArchivo
        titulo="Subir estudio de Rayos"
        endpoint="/api/staff/servicios/rayos"
        accept=".pdf,.jpg,.jpeg,.png,.dcm"
      />
    </div>
  );
}
