"use client";

import { useState } from "react";

export default function EstudiosAdicionalesSelect({
  value = [],
  onChange,
  estudiosDisponibles = [],
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleEstudio = (estudio) => {
    let updated;

    if (value.includes(estudio)) {
      updated = value.filter((x) => x !== estudio);
    } else {
      updated = [...value, estudio];
    }

    onChange(updated);
  };

  const filtered = estudiosDisponibles.filter((est) =>
    est.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative space-y-3">
      {/* TAGS */}
      <div className="flex flex-wrap gap-2">
        {value.map((est, idx) => (
          <span
            key={`tag-${idx}`}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1 animate-fadeIn"
          >
            {est}
            <button
              type="button"
              className="text-red-500 font-bold"
              onClick={() => toggleEstudio(est)}
            >
              ×
            </button>
          </span>
        ))}

        {value.length === 0 && (
          <p className="text-sm text-gray-500">No hay estudios seleccionados</p>
        )}
      </div>

      {/* BOTÓN */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border px-4 py-2 rounded-lg flex justify-between items-center bg-white shadow-sm hover:bg-gray-50 transition"
      >
        {value.length === 0
          ? "Agregar estudios..."
          : `${value.length} seleccionado(s)`}

        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-10 mt-1 w-full border bg-white rounded-lg shadow-lg p-3 animate-fadeIn">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full border px-3 py-2 rounded-lg mb-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Lista */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((est, i) => (
              <div
                key={`opt-${i}`}
                onClick={() => toggleEstudio(est)}
                className={`px-3 py-2 cursor-pointer rounded-lg mb-1 flex justify-between items-center transition 
                  ${
                    value.includes(est)
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {est}
                {value.includes(est) && <span>✓</span>}
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-gray-500 text-sm px-2 py-1">Sin resultados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
