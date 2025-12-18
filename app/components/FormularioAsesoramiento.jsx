"use client";

import { useState } from "react";
import { enviarAsesoramiento } from "@/app/empresa/api/asesoramientoApi";

export default function FormularioAsesoramiento() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [archivo, setArchivo] = useState(null);

  const [form, setForm] = useState({
    solicitanteNombre: "",
    solicitanteCelular: "",
    emailContacto: "", // ✅ NUEVO CAMPO
    puesto: "",
    tareas: "",
    tareasLivianas: "no",
    motivo: "",
    detalles: "",
  });

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

    setForm((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
  };

  const enviar = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries({
        ...form,
        tareasLivianas: form.tareasLivianas === "si",
      }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (archivo) {
        formData.append("archivo", archivo);
      }

      await enviarAsesoramiento(null, formData);
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  if (ok) {
    return (
      <div className="text-center py-12 space-y-6">
        <h2 className="text-3xl font-bold text-green-600">
          Solicitud enviada con éxito
        </h2>
        <p className="text-gray-700 text-lg">
          El equipo médico analizará la situación y se comunicará contigo por mail.
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

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      <a
        href="/empresa/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition font-medium"
      >
        <span className="text-lg">←</span>
        Volver al menú
      </a>

      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Solicitud de Asesoramiento Médico
      </h1>

      {/* SOLICITANTE */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="input"
            name="solicitanteNombre"
            placeholder="Nombre del contacto"
            value={form.solicitanteNombre}
            onChange={handleChange}
          />

          <input
            className="input"
            name="solicitanteCelular"
            placeholder="Celular del contacto"
            value={form.solicitanteCelular}
            onChange={handleChange}
          />

          {/* ✅ EMAIL DE CONTACTO */}
          <input
            className="input sm:col-span-2"
            name="emailContacto"
            type="email"
            placeholder="Email de contacto"
            value={form.emailContacto}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* EMPLEADO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
        <input
          className="input"
          name="puesto"
          placeholder="Puesto"
          value={form.puesto}
          onChange={handleChange}
        />

        <textarea
          className="input h-28"
          name="tareas"
          value={form.tareas}
          onChange={handleChange}
        />
      </div>

      {/* ✅ REQUERIMIENTO */}
      <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">

        <label>¿Tienen tareas livianas?</label>
        <select
          className="input"
          name="tareasLivianas"
          value={form.tareasLivianas}
          onChange={handleChange}
        >
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>

        <label>Motivo</label>
        <select
          className="input"
          name="motivo"
          value={form.motivo}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          <option value="lesion">Lesión</option>
          <option value="clinica">Evaluación clínica</option>
          <option value="trauma">Trauma</option>
          <option value="accidente">Accidente</option>
          <option value="otro">Otro</option>
        </select>

        <textarea
          className="input h-32"
          name="detalles"
          value={form.detalles}
          onChange={handleChange}
        />

        {/* ✅ ARCHIVO */}
        <label className="inline-flex items-center gap-2 cursor-pointer">
          📎 Adjuntar archivo
          <input type="file" className="hidden" onChange={handleArchivo} />
        </label>

        {archivo && (
          <p className="text-sm text-green-700">
            Archivo: {archivo.name}
          </p>
        )}
      </div>

      <button
        onClick={enviar}
        disabled={loading}
        className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </div>
  );
}
