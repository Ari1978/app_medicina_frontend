"use client";

import { useState } from "react";

export default function EstudiosAdicionalesSelect({
  value = [],                // string[] CODIGOS
  onChange,
  estudiosDisponibles = [],  // [{ codigo, nombre, sector }]
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (codigo) => {
    const cod = String(codigo);
    onChange(
      value.includes(cod)
        ? value.filter((c) => c !== cod)
        : [...value, cod]
    );
  };

  const filtered = estudiosDisponibles.filter((e) => {
    if (!e?.codigo || !e?.nombre) return false;
    const text = `${e.nombre} ${e.sector}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="relative space-y-2">
      {/* TAGS */}
      <div className="flex flex-wrap gap-2">
        {value.map((codigo) => {
          const est = estudiosDisponibles.find(
            (e) => String(e.codigo) === String(codigo)
          );
          if (!est) return null;

          return (
            <span
              key={codigo}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
            >
              {est.nombre}
              <button
                type="button"
                className="ml-2 text-red-500 font-bold"
                onClick={() => toggle(codigo)}
              >
                ×
              </button>
            </span>
          );
        })}

        {value.length === 0 && (
          <p className="text-sm text-gray-500">
            No hay estudios seleccionados
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border px-3 py-2 rounded"
      >
        Agregar estudios
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-white border rounded p-2 shadow">
          <input
            className="w-full border px-2 py-1 mb-2"
            placeholder="Buscar por nombre o sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-48 overflow-y-auto">
            {filtered.map((e) => {
              const cod = String(e.codigo);
              const selected = value.includes(cod);

              return (
                <div
                  key={cod}
                  onClick={() => toggle(cod)}
                  className={`px-2 py-1 cursor-pointer text-sm ${
                    selected
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {e.nombre}{" "}
                  <span className="text-xs opacity-70">
                    ({e.sector})
                  </span>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">
                No se encontraron estudios
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
