'use client';

import { useEffect, useState } from 'react';
import { listarArchivosServicio } from '../servicios/api/serviciosArchivosApi';

export default function ServicioArchivosList({ servicioId }) {
  const [archivos, setArchivos] = useState([]);

  useEffect(() => {
    listarArchivosServicio(servicioId).then(setArchivos);
  }, [servicioId]);

  return (
    <div className="space-y-4">
      {archivos.map((a) => (
        <div
          key={a._id}
          className="border rounded p-3 space-y-1"
        >
          <p className="font-medium">{a.filename}</p>
          <p className="text-xs text-gray-500">
            {a.mimeType}
          </p>

          {a.preview && (
            <a
              href={a.preview}
              target="_blank"
              className="text-blue-600 text-sm underline"
            >
              Ver preview
            </a>
          )}

          {!a.preview && (
            <a
              href={a.original}
              target="_blank"
              className="text-blue-600 text-sm underline"
            >
              Descargar
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
