"use client";

import { useEffect, useState } from "react";
import { getDisponibilidad } from "@/app/empresa/api/disponibilidadApi";

export default function Paso4Hora({ form, setForm, next, back }) {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!form.fecha) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Funciona con cookies en local y producción
        const dispo = await getDisponibilidad(form.fecha);

        setHoras(Array.isArray(dispo) ? dispo : []);
      } catch (err) {
        console.error("Error disponibilidad:", err);
        setError("No se pudo cargar la disponibilidad");
        setHoras([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form.fecha]);

  const seleccionarHora = (h) => {
    if (!h.disponible) return;

    setForm({
      ...form,
      hora: h.hora,
    });

    next();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Seleccionar Hora</h2>

      {loading && (
        <p className="text-gray-600 text-sm">Cargando disponibilidad...</p>
      )}

      {error && (
        <p className="text-red-600 text-sm font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {horas.map((h, i) => (
          <button
            key={`hora-${i}`}
            onClick={() => seleccionarHora(h)}
            disabled={!h.disponible}
            className={`p-4 border rounded-lg text-center font-semibold transition shadow-sm 
              ${
                h.disponible
                  ? "bg-green-100 hover:bg-green-200"
                  : "bg-red-100 opacity-60 cursor-not-allowed"
              }
            `}
          >
            {h.hora}
            <div className="text-sm text-gray-700">
              Libres: {h.libres}
            </div>
          </button>
        ))}
      </div>

      <button
        className="border px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
        onClick={back}
      >
        Volver
      </button>
    </div>
  );
}
