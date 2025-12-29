'use client';

import { useState } from 'react';
import { subirArchivoServicio } from '../servicios/api/serviciosArchivosApi';

export default function ServicioArchivoUpload({ servicioId }) {
  const [loading, setLoading] = useState(false);

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await subirArchivoServicio(servicioId, file);
      alert('Archivo subido');
    } catch (err) {
      alert('Error al subir archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={onChange}
        disabled={loading}
      />

      {loading && (
        <p className="text-sm text-gray-500">
          Subiendo archivo...
        </p>
      )}
    </div>
  );
}
