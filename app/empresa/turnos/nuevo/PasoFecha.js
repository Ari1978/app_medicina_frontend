"use client";

export default function Paso3Fecha({ form, setForm, next, back }) {
  const isValid = form.fecha?.trim();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Seleccionar Fecha</h2>

      <div>
        <label className="block text-sm font-semibold mb-1">Fecha del turno</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white transition"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={back}
          className="border px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
        >
          Volver
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={next}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
            isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
