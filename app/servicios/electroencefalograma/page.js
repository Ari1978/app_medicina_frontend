"use client";

import UploadArchivo from "@/app/components/UploadArchivo";

export default function ElectroencefalogramaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Electroencefalograma</h1>
      <UploadArchivo
        titulo="Subir Electroencefalograma"
        endpoint="/api/staff/servicios/electroencefalograma"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}
