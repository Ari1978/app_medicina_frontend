"use client";

import { useState } from "react";
import { enviarTurnoEspecial } from "@/app/empresa/api/turnoEspecialApi";

export default function FormularioTurnoEspecial() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const [form, setForm] = useState({
    empleadoApellido: "",
    empleadoNombre: "",
    empleadoDni: "",
    puesto: "",
    tareasLivianas: "",
    recibioAsesoramiento: "",
    urgencia: "",
    motivo: "",
    detalles: "",
    solicitadoPorNombre: "",
    solicitadoPorCelular: "",
  });

  // -----------------------------
  // VALIDACIONES
  // -----------------------------
  const soloLetras = (v) =>
    v.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ\s]/g, "");

  const soloNumeros = (v) => v.replace(/\D/g, "");

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (["empleadoApellido", "empleadoNombre", "solicitadoPorNombre"].includes(name)) {
      value = soloLetras(value);
    }

    if (["empleadoDni", "solicitadoPorCelular"].includes(name)) {
      value = soloNumeros(value);
    }

    setForm({ ...form, [name]: value });
  };

  // -----------------------------
  // ENVIAR FORMULARIO
  // -----------------------------
  const enviar = async () => {
    setLoading(true);

    try {
      const payload = {
        ...form,
        tareasLivianas: form.tareasLivianas === "si",
        recibioAsesoramiento: form.recibioAsesoramiento === "si",
        urgencia: form.urgencia === "si",
      };

      await enviarTurnoEspecial(null, payload);
      setOk(true);

    } catch (err) {
      console.error(err);
      alert("Error al enviar el turno especial");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // ÉXITO
  // -----------------------------
  if (ok) {
    return (
      <div className="text-center py-12 space-y-6">
        <h2 className="text-3xl font-bold text-green-600">
          Turno Especial enviado con éxito
        </h2>

        <p className="text-gray-700 text-lg">
          El equipo de ASMEL revisará la solicitud y se comunicará con usted.
        </p>

        <a
          href="/empresa/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
        >
          Volver al Dashboard
        </a>
      </div>
    );
  }

  // -----------------------------
  // FORMULARIO
  // -----------------------------
  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Solicitud de Turno Especial
      </h1>

      {/* CARD EMPLEADO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Datos del Empleado</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="input"
            name="empleadoApellido"
            placeholder="Apellido"
            value={form.empleadoApellido}
            onChange={handleChange}
          />

          <input
            className="input"
            name="empleadoNombre"
            placeholder="Nombre"
            value={form.empleadoNombre}
            onChange={handleChange}
          />

          <input
            className="input"
            name="empleadoDni"
            placeholder="DNI"
            value={form.empleadoDni}
            onChange={handleChange}
            inputMode="numeric"
          />

          <input
            className="input"
            name="puesto"
            placeholder="Puesto"
            value={form.puesto}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* CARD INFORMACIÓN CLÍNICA */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Información Clínica</h2>

        {/* Recibió asesoramiento médico */}
        <label className="font-semibold">¿Recibió asesoramiento médico?</label>
        <select
          className="input"
          name="recibioAsesoramiento"
          value={form.recibioAsesoramiento}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>

        {/* Urgencia */}
        <label className="font-semibold">¿El turno es urgente?</label>
        <select
          className="input"
          name="urgencia"
          value={form.urgencia}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>

        {/* Tareas livianas */}
        <label className="font-semibold">¿Se solicitaron tareas livianas?</label>
        <select
          className="input"
          name="tareasLivianas"
          value={form.tareasLivianas}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* CARD MOTIVO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Motivo</h2>

        <select
          className="input"
          name="motivo"
          value={form.motivo}
          onChange={handleChange}
        >
          <option value="">Seleccione motivo</option>
          <option value="Traumatología">Traumatología</option>
          <option value="Psicología">Psicología</option>
          <option value="Psiquiatría">Psiquiatría</option>
          <option value="Otro">Otro</option>
        </select>

        <textarea
          className="input h-28"
          name="detalles"
          placeholder="Describa el motivo / evento / situación"
          value={form.detalles}
          onChange={handleChange}
        />
      </div>

      {/* CARD SOLICITANTE */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Solicitado por</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="input"
            name="solicitadoPorNombre"
            placeholder="Nombre del solicitante"
            value={form.solicitadoPorNombre}
            onChange={handleChange}
          />

          <input
            className="input"
            name="solicitadoPorCelular"
            placeholder="Celular"
            value={form.solicitadoPorCelular}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>
      </div>

      {/* BOTÓN ENVIAR */}
      <button
        onClick={enviar}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Enviando..." : "Enviar Turno Especial"}
      </button>
    </div>
  );
}
