'use client';

import { useEffect, useState } from 'react';
import {
  listarArchivosServicio,
  eliminarArchivoServicio,
} from '../api/serviciosArchivosApI';

export default function ServicioArchivosPreview({
  servicioId,
}) {
  const [archivos, setArchivos] = useState([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const cargar = async () => {
    const data = await listarArchivosServicio(servicioId);
    setArchivos(data);
  };

  useEffect(() => {
    cargar();
  }, [servicioId]);

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar archivo?')) return;

    try {
      setLoadingId(id);
      await eliminarArchivoServicio(id);
      await cargar();
    } catch {
      alert('Error al eliminar archivo');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {archivos.map((a) => (
        <div
          key={a._id}
          className="border rounded-lg p-4 space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{a.filename}</p>
              <p className="text-xs text-gray-500">
                {a.mimeType}
              </p>
            </div>

            <button
              onClick={() => eliminar(a._id)}
              disabled={loadingId === a._id}
              className="text-red-600 text-sm underline"
            >
              {loadingId === a._id
                ? 'Eliminando...'
                : 'Eliminar'}
            </button>
          </div>

          {/* Imagen */}
          {a.preview && a.mimeType.startsWith('image/') && (
            <img
              src={a.preview}
              className="max-h-64 rounded border"
            />
          )}

          {/* PDF */}
          {a.preview && a.mimeType === 'application/pdf' && (
            <iframe
              src={a.preview}
              className="w-full h-96 border rounded"
            />
          )}

          {!a.preview && (
            <a
              href={a.original}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              Descargar archivo
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
