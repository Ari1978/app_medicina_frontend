"use client";

import { useEffect, useState } from "react";

export default function NuevoPacientePage() {
  const [loading, setLoading] = useState(false);

  const [busquedaEmpresa, setBusquedaEmpresa] = useState("");
  const [sugerencias, setSugerencias] = useState([]);

  const [form, setForm] = useState({
    empresa: "",
    apellido: "",
    nombre: "",
    dni: "",
    estadoCivil: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    puesto: "",
    horario: "",
    direccion: "",
    entreCalles: "",
    localidad: "",
    partido: "",
    provincia: "",
    telefono: "",
    otros: "",
  });

  // ===============================
  // ✅ AUTOCOMPLETE INCREMENTAL REAL
  // ===============================
  useEffect(() => {
    if (busquedaEmpresa.length < 2) {
      setSugerencias([]);
      return;
    }

    const buscar = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/empresa/buscar?query=${busquedaEmpresa}`,
          { credentials: "include" }
        );

        const data = await res.json();
        setSugerencias(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error buscando empresas", err);
      }
    };

    buscar();
  }, [busquedaEmpresa]);

  const seleccionarEmpresa = (empresa) => {
    setForm({ ...form, empresa: empresa.razonSocial });
    setBusquedaEmpresa(empresa.razonSocial);
    setSugerencias([]);
  };

  // ===============================
  // ✅ MANEJO DE CAMPOS
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // ✅ GUARDA REAL EN BACKEND
  // ===============================
  const guardar = async () => {
    if (!form.empresa || !form.apellido || !form.nombre || !form.dni) {
      alert("Empresa, Apellido, Nombre y DNI son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:4000/api/recepcion/pacientes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error");

      alert("✅ Paciente guardado correctamente");

      setForm({
        empresa: "",
        apellido: "",
        nombre: "",
        dni: "",
        estadoCivil: "",
        fechaNacimiento: "",
        fechaIngreso: "",
        puesto: "",
        horario: "",
        direccion: "",
        entreCalles: "",
        localidad: "",
        partido: "",
        provincia: "",
        telefono: "",
        otros: "",
      });

      setBusquedaEmpresa("");
      setSugerencias([]);
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar paciente");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">
          Alta de Paciente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ✅ EMPRESA CON AUTOCOMPLETE */}
          <Field label="Empresa">
            <div className="relative">
              <input
                value={busquedaEmpresa}
                onChange={(e) => setBusquedaEmpresa(e.target.value)}
                className="input"
                placeholder="Buscar empresa..."
              />

              {sugerencias.length > 0 && (
                <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
                  {sugerencias.map((e) => (
                    <div
                      key={e._id}
                      onClick={() => seleccionarEmpresa(e)}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                    >
                      {e.razonSocial}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Apellido">
            <input name="apellido" onChange={handleChange} className="input" />
          </Field>

          <Field label="Nombre">
            <input name="nombre" onChange={handleChange} className="input" />
          </Field>

          <Field label="DNI">
            <input name="dni" onChange={handleChange} className="input" />
          </Field>

          <Field label="Estado Civil">
            <select name="estadoCivil" onChange={handleChange} className="input">
              <option value="">Seleccionar</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="divorciado">Divorciado/a</option>
            </select>
          </Field>

          <Field label="Fecha de Nacimiento">
            <input type="date" name="fechaNacimiento" onChange={handleChange} className="input" />
          </Field>

          <Field label="Fecha de Ingreso">
            <input type="date" name="fechaIngreso" onChange={handleChange} className="input" />
          </Field>

          <Field label="Puesto">
            <input name="puesto" onChange={handleChange} className="input" />
          </Field>

          <Field label="Horario de Trabajo">
            <input name="horario" onChange={handleChange} className="input" />
          </Field>

          <Field label="Dirección">
            <input name="direccion" onChange={handleChange} className="input" />
          </Field>

          <Field label="Entre Calles">
            <input name="entreCalles" onChange={handleChange} className="input" />
          </Field>

          <Field label="Localidad">
            <input name="localidad" onChange={handleChange} className="input" />
          </Field>

          <Field label="Partido">
            <input name="partido" onChange={handleChange} className="input" />
          </Field>

          <Field label="Provincia">
            <input name="provincia" onChange={handleChange} className="input" />
          </Field>

          <Field label="Teléfono">
            <input name="telefono" onChange={handleChange} className="input" />
          </Field>

          <div className="lg:col-span-3">
            <Field label="Otros Datos">
              <textarea name="otros" onChange={handleChange} className="input min-h-[120px]" />
            </Field>
          </div>

        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button className="px-6 py-2 rounded-lg border hover:bg-gray-100 transition">
            Cancelar
          </button>

          <button
            onClick={guardar}
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
          >
            {loading ? "Guardando..." : "Guardar Paciente"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #cbd5f5;
          padding: 0.5rem 0.75rem;
          outline: none;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}
