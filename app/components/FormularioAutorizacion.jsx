
"use client";

import { useState } from "react";
import { enviarAutorizacion } from "@/app/empresa/api/autorizacionApi";

export default function FormularioAutorizacion() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const [form, setForm] = useState({
    empleadoApellido: "",
    empleadoNombre: "",
    motivo: "",
    autorizadoPor: "",
    solicitanteCelular: "",
    aclaraciones: "",
  });

  // -----------------------------
  // VALIDACIÓN
  // -----------------------------
  const soloLetras = (v) =>
    v.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ\s]/g, "");

  const soloNumeros = (v) => v.replace(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (
      name === "empleadoApellido" ||
      name === "empleadoNombre" ||
      name === "autorizadoPor"
    ) {
      nuevoValor = soloLetras(value);
    }

    if (name === "solicitanteCelular") {
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
      await enviarAutorizacion(null, form);
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Error al enviar la autorización");
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
          Autorización enviada con éxito
        </h2>

        <p className="text-gray-700 text-lg">
          El equipo médico procesará la solicitud.
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

      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Solicitud de Autorización Médica
      </h1>

      {/* CARD: EMPLEADO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Datos del Empleado
        </h2>

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
        </div>

        <div>
          <label className="font-semibold text-gray-700 mb-1 block">
            Motivo de la autorización
          </label>

          <select
            className="input"
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            <option value="clinica">Clinica Medica</option>
            <option value="traumatologia">Traumatologia</option>
            <option value="accidente no declarado">Accidente no declarado</option>
            <option value="accidente declarado">Accidente declarado</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* CARD: AUTORIZANTE */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Quien autoriza
        </h2>

        <input
          className="input"
          name="autorizadoPor"
          placeholder="Nombre y apellido"
          value={form.autorizadoPor}
          onChange={handleChange}
        />

        <input
          className="input"
          name="solicitanteCelular"
          placeholder="Celular de contacto"
          value={form.solicitanteCelular}
          onChange={handleChange}
          inputMode="numeric"
          pattern="\d*"
        />
      </div>

      {/* CARD: DETALLES */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Detalles</h2>

        <textarea
          name="aclaraciones"
          placeholder="Aclaraciones o detalles adicionales"
          className="input h-32"
          value={form.aclaraciones}
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
        {loading ? "Enviando..." : "Enviar Autorización"}
      </button>
    </div>
  );
}
