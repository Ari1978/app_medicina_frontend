"use client";

import UploadArchivo from "@/app/components/UploadArchivo";

export default function EspirometriaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Espirometría</h1>
      <UploadArchivo
        titulo="Subir Espirometría"
        endpoint="/api/staff/servicios/espirometria"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}
