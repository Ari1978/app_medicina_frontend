"use client";

import { useEffect, useState } from "react";
import {
  listarArchivosServicio,
  descargarArchivoServicio,
  eliminarArchivoServicio,
  getPreviewUrl,
} from "../servicios/api/serviciosArchivosApi";

export default function ServicioArchivos({ servicioId }) {
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!servicioId) return;

    setLoading(true);
    listarArchivosServicio(servicioId)
      .then(setArchivos)
      .finally(() => setLoading(false));
  }, [servicioId]);

  if (!servicioId) {
    return (
      <div className="rounded-xl border bg-white p-6 text-gray-500">
        No hay servicio seleccionado
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 animate-pulse">
        Cargando archivos…
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Archivos del servicio
        </h2>
      </div>

      {archivos.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">
          No hay archivos cargados
        </div>
      ) : (
        <ul className="divide-y">
          {archivos.map((a) => (
            <li
              key={a._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{a.filename}</p>
                <p className="text-xs text-gray-500">
                  Área: {a.area}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <a
                  href={getPreviewUrl(a._id)}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </a>

                <button
                  onClick={() =>
                    descargarArchivoServicio(a._id, a.filename)
                  }
                  className="text-gray-600 hover:underline"
                >
                  Descargar
                </button>

                <button
                  onClick={async () => {
                    await eliminarArchivoServicio(a._id);
                    setArchivos((prev) =>
                      prev.filter((x) => x._id !== a._id)
                    );
                  }}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
