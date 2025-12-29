"use client";

import UploadArchivo from "@/app/servicios/components/UploadArchivo";

export default function ElectrocardiogramaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Electrocardiograma</h1>
      <UploadArchivo
        titulo="Subir Electrocardiograma"
        endpoint="/api/staff/servicios/electrocardiograma"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}
