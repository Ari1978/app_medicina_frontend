'use client';

import { useState } from 'react';
import {
  subirArchivoServicioConProgreso,
} from '../servicios/api/serviciosArchivosApi';

export default function ServicioArchivoDropzoneProgreso({
  servicioId,
}) {
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const subir = async (file: File) => {
    setLoading(true);
    setProgress(0);
    setFileName(file.name);

    try {
      await subirArchivoServicioConProgreso(
        servicioId,
        file,
        setProgress,
      );
    } catch {
      alert('Error al subir archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) subir(file);
      }}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center
        transition
        ${drag ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
      `}
    >
      <p className="font-medium">
        Arrastrá el archivo acá
      </p>

      <input
        type="file"
        className="hidden"
        id="fileInputProgreso"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) subir(file);
        }}
      />

      <label
        htmlFor="fileInputProgreso"
        className="inline-block mt-3 cursor-pointer text-blue-600 underline"
      >
        Seleccionar archivo
      </label>

      {loading && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Subiendo: {fileName}
          </p>

          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-blue-600 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            {progress}%
          </p>
        </div>
      )}
    </div>
  );
}
