"use client";

import UploadArchivo from "@/app/components/UploadArchivo";

export default function FonoaudiologiaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Servicio de Fonoaudiología</h1>
      <UploadArchivo
        titulo="Subir informe de Fonoaudiología"
        endpoint="/api/staff/servicios/fonoaudiologia"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}
