"use client";

import { useState } from "react";
import { enviarPresupuesto } from "@/app/empresa/api/presupuestoApi";

export default function FormularioPresupuesto() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const [form, setForm] = useState({
    empleadoApellido: "",
    empleadoNombre: "",
    celular: "",
    emailContacto: "", // ✅ NUEVO
    motivo: "",
    detalles: "",
    tipoServicio: "",
    urgencia: "",
  });

  // -----------------------------
  // VALIDACIONES
  // -----------------------------
  const soloLetras = (v) => v.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ\s]/g, "");
  const soloNumeros = (v) => v.replace(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === "empleadoApellido" || name === "empleadoNombre") {
      nuevoValor = soloLetras(value);
    }

    if (name === "celular") {
      nuevoValor = soloNumeros(value);
    }

    setForm({ ...form, [name]: nuevoValor });
  };

  // -----------------------------
  // ENVIAR
  // -----------------------------
  const enviar = async () => {
    setLoading(true);
    try {
      await enviarPresupuesto(null, form);
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el presupuesto");
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
          Solicitud enviada con éxito
        </h2>

        <p className="text-gray-700 text-lg">
          Nuestro equipo preparará el presupuesto solicitado y se comunicará por mail.
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
      {/* ✅ BOTÓN VOLVER SUTIL */}
      <a
        href="/empresa/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition font-medium"
      >
        <span className="text-lg">←</span>
        Volver al menú
      </a>

      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Solicitud de Presupuesto
      </h1>

      {/* CARD: DATOS DE CONTACTO */}
<div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
  <h2 className="text-xl font-semibold text-gray-800">
    Datos de Contacto
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      className="input"
      name="empleadoApellido"
      placeholder="Apellido del contacto"
      value={form.empleadoApellido}
      onChange={handleChange}
    />

    <input
      className="input"
      name="empleadoNombre"
      placeholder="Nombre del contacto"
      value={form.empleadoNombre}
      onChange={handleChange}
    />
  </div>

  <input
    className="input"
    name="celular"
    placeholder="Celular de contacto"
    value={form.celular}
    onChange={handleChange}
    inputMode="numeric"
    pattern="\d*"
  />

  {/* ✅ EMAIL CONTACTO */}
  <input
    className="input"
    type="email"
    name="emailContacto"
    placeholder="Email de contacto"
    value={form.emailContacto}
    onChange={handleChange}
  />
</div>


      {/* CARD: TIPO DE SERVICIO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Servicio Solicitado
        </h2>

        <select
          name="tipoServicio"
          className="input"
          value={form.tipoServicio}
          onChange={handleChange}
        >
          <option value="">Seleccione tipo de servicio</option>
          <option value="examen_ingreso">Examen de Ingreso</option>
          <option value="examen_egreso">Examen de Egreso</option>
          <option value="examen_periodico">Examen Periódico</option>
          <option value="visita_medica">Visita Médica</option>
          <option value="estudios">Estudios Complementarios</option>
          <option value="otros">Otros</option>
        </select>

        <label className="font-semibold text-gray-700">Urgencia</label>
        <select
          name="urgencia"
          className="input"
          value={form.urgencia}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="normal">Normal</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      {/* CARD: DESCRIPCIÓN */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Detalles del Pedido
        </h2>

        <input
          className="input"
          name="motivo"
          placeholder="Motivo del presupuesto"
          value={form.motivo}
          onChange={handleChange}
        />

        <textarea
          name="detalles"
          placeholder="Detalles adicionales o especificaciones necesarias"
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
        {loading ? "Enviando..." : "Enviar Solicitud de Presupuesto"}
      </button>
    </div>
  );
}
