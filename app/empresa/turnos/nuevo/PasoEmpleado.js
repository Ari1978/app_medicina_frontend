"use client";

export default function Paso1Empleado({ form, setForm, next }) {

  const soloLetras = (str) =>
    str.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");

  const soloNumeros = (str) =>
    str.replace(/\D/g, "");

  const handle = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "empleadoNombre" || name === "empleadoApellido" || name === "puesto") {
      nuevoValor = soloLetras(value);
    }

    if (name === "empleadoDni") {
      nuevoValor = soloNumeros(value);
    }

    setForm({
      ...form,
      [name]: nuevoValor,
    });
  };

  const isValid =
    form.empleadoNombre?.trim() &&
    form.empleadoApellido?.trim() &&
    form.empleadoDni?.trim() &&
    /^\d+$/.test(form.empleadoDni);

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold text-gray-800">Datos del Empleado</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
          placeholder="Nombre"
          name="empleadoNombre"
          onChange={handle}
          value={form.empleadoNombre}
        />

        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
          placeholder="Apellido"
          name="empleadoApellido"
          onChange={handle}
          value={form.empleadoApellido}
        />

        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
          placeholder="DNI"
          name="empleadoDni"
          onChange={handle}
          value={form.empleadoDni}
          maxLength={10}
        />

        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
          placeholder="Puesto (opcional)"
          name="puesto"
          onChange={handle}
          value={form.puesto}
        />

      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">

        <button
          className={`px-6 py-3 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
            isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
          }`}
          onClick={next}
          disabled={!isValid}
        >
          Siguiente
        </button>

      </div>
    </div>
  );
}
