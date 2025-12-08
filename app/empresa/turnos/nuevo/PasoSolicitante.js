"use client";

export default function Paso5Solicitante({ form, setForm, next, back }) {
  const handle = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const isValid =
    form.solicitanteNombre?.trim() &&
    form.solicitanteApellido?.trim() &&
    form.solicitanteCelular?.trim();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Datos del Solicitante</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white transition"
          placeholder="Nombre"
          name="solicitanteNombre"
          value={form.solicitanteNombre}
          onChange={handle}
        />

        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white transition"
          placeholder="Apellido"
          name="solicitanteApellido"
          value={form.solicitanteApellido}
          onChange={handle}
        />

        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white transition"
          placeholder="Celular"
          name="solicitanteCelular"
          value={form.solicitanteCelular}
          onChange={handle}
        />
      </div>

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          className="border px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
          onClick={back}
        >
          Volver
        </button>

        <button
          className={`px-6 py-3 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
            isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
          }`}
          disabled={!isValid}
          onClick={next}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
