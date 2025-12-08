"use client";

import { useState } from "react";
import { enviarVisita } from "@/app/empresa/api/vistasApi";

// -----------------------------------------------------
// 🎯 DATA: Zonas -> Localidades
// -----------------------------------------------------
const ZONAS = {
  "CABA": ["Palermo", "Recoleta", "Belgrano", "Caballito", "Flores"],
  "Zona Norte": ["San Isidro", "Vicente López", "Tigre", "San Fernando"],
  "Zona Sur": ["Avellaneda", "Lanús", "Lomas de Zamora", "Quilmes"],
  "Zona Oeste": ["Morón", "Ituzaingó", "Merlo", "Moreno"],
};

export default function FormularioVisita() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const [form, setForm] = useState({
    empleadoApellido: "",
    empleadoNombre: "",
    empleadoDni: "",
    puesto: "",
    direccion: "",
    zona: "",
    localidad: "",
    motivo: "",
    solicitanteNombre: "",
    solicitanteCelular: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async () => {
    setLoading(true);

    try {
      const response = await enviarVisita(null, form);
      console.log(response);
      setOk(true);
    } catch (err) {
      alert("Error al enviar solicitud");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // 🎉 PANTALLA DE ÉXITO
  // -----------------------------------------------------
  if (ok) {
    return (
      <div className="text-center py-12 space-y-6">
        <h2 className="text-3xl font-bold text-green-600">
          Solicitud enviada con éxito
        </h2>
        <p className="text-gray-700 text-lg">
          Nuestro equipo coordinará la visita a la brevedad.
        </p>

        <a
          href="/empresa/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block shadow"
        >
          Volver al menú
        </a>
      </div>
    );
  }

  // -----------------------------------------------------
  // 🧩 INPUT STYLE (uniforme al de turnos)
  // -----------------------------------------------------
  const baseInput =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm";

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-700">
        Solicitud de Visita Médica
      </h1>

      {/* EMPLEADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={baseInput}
          name="empleadoApellido"
          placeholder="Apellido del empleado"
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="empleadoNombre"
          placeholder="Nombre del empleado"
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="empleadoDni"
          placeholder="DNI"
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="puesto"
          placeholder="Puesto (opcional)"
          onChange={handleChange}
        />
      </div>

      {/* ZONA / LOCALIDAD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ZONA */}
        <select
          className={baseInput}
          name="zona"
          value={form.zona}
          onChange={(e) => {
            setForm({
              ...form,
              zona: e.target.value,
              localidad: "",
            });
          }}
        >
          <option value="">Seleccione zona</option>
          {Object.keys(ZONAS).map((zona) => (
            <option key={zona} value={zona}>
              {zona}
            </option>
          ))}
        </select>

        {/* LOCALIDAD */}
        <select
          className={baseInput}
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
          disabled={!form.zona}
        >
          <option value="">Seleccione localidad</option>

          {form.zona &&
            ZONAS[form.zona].map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
        </select>
      </div>

      {/* DIRECCIÓN */}
      <input
        className={baseInput}
        name="direccion"
        placeholder="Dirección donde se realizará la visita"
        onChange={handleChange}
      />

      {/* MOTIVO */}
      <textarea
        className={`${baseInput} h-28 resize-none`}
        name="motivo"
        placeholder="Describa el motivo de la visita"
        onChange={handleChange}
      />

      {/* SOLICITANTE */}
      <h2 className="text-xl font-semibold text-gray-700 pt-2">
        Datos del solicitante
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={baseInput}
          name="solicitanteNombre"
          placeholder="Nombre del solicitante"
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="solicitanteCelular"
          placeholder="Celular del solicitante"
          onChange={handleChange}
        />
      </div>

      {/* BOTÓN */}
      <button
        onClick={enviar}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold shadow ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </div>
  );
}
