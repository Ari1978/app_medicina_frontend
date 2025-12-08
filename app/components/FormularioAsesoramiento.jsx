"use client";

import { useState } from "react";
import { enviarAsesoramiento } from "@/app/empresa/api/asesoramientoApi";

export default function FormularioAsesoramiento() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const [form, setForm] = useState({
    solicitanteNombre: "",
    solicitanteCelular: "",
    puesto: "",
    tareas: "",
    tareasLivianas: "no",
    motivo: "",
    detalles: "",
  });

  // -----------------------------
  // HELPERS DE VALIDACIÓN
  // -----------------------------
  const soloLetras = (value) =>
    value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");

  const soloNumeros = (value) => value.replace(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "solicitanteNombre" || name === "puesto") {
      nuevoValor = soloLetras(value);
    }

    if (name === "solicitanteCelular") {
      nuevoValor = soloNumeros(value);
    }

    // textareas (tareas, detalles) quedan libres
    setForm((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));
  };

  const enviar = async () => {
    setLoading(true);

    try {
      const payload = {
        ...form,
        tareasLivianas: form.tareasLivianas === "si",
      };

      await enviarAsesoramiento(null, payload);
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // VISTA ÉXITO
  // -----------------------------
  if (ok) {
    return (
      <div className="text-center py-12 space-y-6">
        <h2 className="text-3xl font-bold text-green-600">
          Solicitud enviada con éxito
        </h2>
        <p className="text-gray-700 text-lg">
          El equipo médico analizará la situación y se comunicará contigo.
        </p>

        <a
          href="/empresa/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
        >
          Volver al menú
        </a>
      </div>
    );
  }

  // -----------------------------
  // FORMULARIO
  // -----------------------------
  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Solicitud de Asesoramiento Médico
      </h1>

      {/* CARD: SOLICITANTE */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Datos del Solicitante
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="input"
            name="solicitanteNombre"
            placeholder="Nombre del solicitante"
            value={form.solicitanteNombre}
            onChange={handleChange}
          />

          <input
            className="input"
            name="solicitanteCelular"
            placeholder="Celular del solicitante"
            value={form.solicitanteCelular}
            onChange={handleChange}
            inputMode="numeric"
            pattern="\d*"
          />
        </div>
      </div>

      {/* CARD: INFORMACIÓN DEL EMPLEADO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Información del Empleado
        </h2>

        <input
          className="input"
          name="puesto"
          placeholder="Puesto"
          value={form.puesto}
          onChange={handleChange}
        />

        <textarea
          name="tareas"
          placeholder="Describa las tareas realizadas"
          className="input h-28"
          value={form.tareas}
          onChange={handleChange}
        />
      </div>

      {/* CARD: REQUERIMIENTO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Detalles del Requerimiento
        </h2>

        {/* TAREAS LIVIANAS */}
        <div>
          <label className="font-semibold text-gray-700 block mb-1">
            ¿Tareas livianas?
          </label>
          <select
            className="input"
            name="tareasLivianas"
            value={form.tareasLivianas}
            onChange={handleChange}
          >
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>

        {/* MOTIVO */}
        <div>
          <label className="font-semibold text-gray-700 block mb-1">
            Motivo
          </label>
          <select
            className="input"
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="lesion">Lesión</option>
            <option value="dolor">Dolor / Molestias</option>
            <option value="accidente">Accidente laboral</option>
            <option value="evaluacion">Evaluación médica</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* DETALLES */}
        <textarea
          name="detalles"
          placeholder="Describa lo ocurrido o detalles relevantes"
          className="input h-32"
          value={form.detalles}
          onChange={handleChange}
        />
      </div>

      {/* BOTÓN ENVIAR */}
      <button
        onClick={enviar}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </div>
  );
}
