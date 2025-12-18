"use client";

import { useEffect, useState } from "react";
import { enviarVisita } from "../empresa/api/visitasApi";

// ✅ SOLO PRODUCCIÓN
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}
const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function FormularioVisita() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  // ✅ GEO DESDE BACK
  const [provincias, setProvincias] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [form, setForm] = useState({
    empleadoApellido: "",
    empleadoNombre: "",
    empleadoDni: "",
    puesto: "",
    direccion: "",
    provincia: "",
    partido: "",
    localidad: "",
    motivo: "",
    solicitanteNombre: "",
    solicitanteCelular: "",
  });

  // -----------------------------
  // ✅ CARGAR PROVINCIAS
  // -----------------------------
  useEffect(() => {
    async function fetchProvincias() {
      const res = await fetch(`${API_URL}/api/geo/provincias`);
      const data = await res.json();
      setProvincias(data);
    }
    fetchProvincias();
  }, []);

  // -----------------------------
  // ✅ CARGAR PARTIDOS
  // -----------------------------
  useEffect(() => {
    if (!form.provincia) return;

    async function fetchPartidos() {
      const res = await fetch(
        `${API_URL}/api/geo/partidos?provincia=${encodeURIComponent(
          form.provincia
        )}`
      );
      const data = await res.json();
      setPartidos(data);
    }

    fetchPartidos();
    setLocalidades([]);
  }, [form.provincia]);

  // -----------------------------
  // ✅ CARGAR LOCALIDADES
  // -----------------------------
  useEffect(() => {
    if (!form.provincia || !form.partido) return;

    async function fetchLocalidades() {
      const res = await fetch(
        `${API_URL}/api/geo/localidades?provincia=${encodeURIComponent(
          form.provincia
        )}&partido=${encodeURIComponent(form.partido)}`
      );
      const data = await res.json();
      setLocalidades(data);
    }

    fetchLocalidades();
  }, [form.provincia, form.partido]);

  // -----------------------------
  // ✅ VALIDACIONES
  // -----------------------------
  const soloLetras = (v) => v.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ\s]/g, "");
  const soloNumeros = (v) => v.replace(/\D/g, "");
  const letrasYNumeros = (v) => v.replace(/[^a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ\s]/g, "");

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (
      [
        "empleadoApellido",
        "empleadoNombre",
        "puesto",
        "solicitanteNombre",
      ].includes(name)
    ) {
      value = soloLetras(value);
    }

    if (["empleadoDni", "solicitanteCelular"].includes(name)) {
      value = soloNumeros(value);
    }

    if (name === "direccion") {
      value = letrasYNumeros(value);
    }

    setForm({ ...form, [name]: value });
  };

  // -----------------------------
  // ✅ ENVIAR (BODY LIMPIO SIN empresaId)
  // -----------------------------
  const enviar = async () => {
    setLoading(true);

    try {
      const bodyLimpio = {
        empleadoApellido: form.empleadoApellido,
        empleadoNombre: form.empleadoNombre,
        empleadoDni: form.empleadoDni,
        puesto: form.puesto,
        direccion: form.direccion,
        provincia: form.provincia,
        partido: form.partido,
        localidad: form.localidad,
        motivo: form.motivo,
        solicitanteNombre: form.solicitanteNombre,
        solicitanteCelular: form.solicitanteCelular,
      };

      console.log("✅ BODY FINAL:", bodyLimpio);

      await enviarVisita(null, bodyLimpio);
      setOk(true);
    } catch (err) {
      alert("Error al enviar solicitud");
      console.error("🔥 ERROR REAL:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // ✅ ÉXITO
  // -----------------------------
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

  // -----------------------------
  // ✅ ESTILOS
  // -----------------------------
  const baseInput =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm";

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
      {/* ✅ BOTÓN VOLVER SUTIL */}
      <a
        href="/empresa/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition font-medium"
      >
        <span className="text-lg">←</span>
        Volver al menú
      </a>

      <h1 className="text-2xl font-bold text-blue-700">
        Solicitud de Visita Médica
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={baseInput}
          name="empleadoApellido"
          placeholder="Apellido"
          value={form.empleadoApellido}
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="empleadoNombre"
          placeholder="Nombre"
          value={form.empleadoNombre}
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="empleadoDni"
          placeholder="DNI"
          value={form.empleadoDni}
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="puesto"
          placeholder="Puesto"
          value={form.puesto}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          className={baseInput}
          value={form.provincia}
          onChange={(e) =>
            setForm({
              ...form,
              provincia: e.target.value,
              partido: "",
              localidad: "",
            })
          }
        >
          <option value="">Provincia</option>
          {provincias.map((p, i) => {
            const value = typeof p === "string" ? p : p.nombre;
            const key = typeof p === "string" ? p : p._id || i;
            return (
              <option key={key} value={value}>
                {value}
              </option>
            );
          })}
        </select>

        <select
          className={baseInput}
          value={form.partido}
          disabled={!form.provincia}
          onChange={(e) =>
            setForm({ ...form, partido: e.target.value, localidad: "" })
          }
        >
          <option value="">Partido</option>
          {partidos.map((p, i) => {
            const value = typeof p === "string" ? p : p.nombre;
            const key = typeof p === "string" ? p : p._id || i;
            return (
              <option key={key} value={value}>
                {value}
              </option>
            );
          })}
        </select>

        <select
          className={baseInput}
          value={form.localidad}
          disabled={!form.partido}
          name="localidad"
          onChange={handleChange}
        >
          <option value="">Localidad</option>
          {localidades.map((l, i) => {
            const value = typeof l === "string" ? l : l.nombre;
            const key = typeof l === "string" ? l : l._id || i;
            return (
              <option key={key} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>

      <input
        className={baseInput}
        name="direccion"
        placeholder="Dirección"
        value={form.direccion}
        onChange={handleChange}
      />

      <textarea
        className={`${baseInput} h-28 resize-none`}
        name="motivo"
        placeholder="Describa el motivo"
        value={form.motivo}
        onChange={(e) => setForm({ ...form, motivo: e.target.value })}
      />

      <h2 className="text-xl font-semibold text-gray-700 pt-2">
        Datos del solicitante
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={baseInput}
          name="solicitanteNombre"
          placeholder="Nombre"
          value={form.solicitanteNombre}
          onChange={handleChange}
        />
        <input
          className={baseInput}
          name="solicitanteCelular"
          placeholder="Celular"
          value={form.solicitanteCelular}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={enviar}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold shadow ${
          loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </div>
  );
}
