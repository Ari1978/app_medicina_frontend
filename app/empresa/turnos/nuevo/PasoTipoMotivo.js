"use client";

import { useEffect, useState } from "react";
import EstudiosAdicionalesSelect from "../../../components/EstudiosAdicionalesSelect";

export default function Paso2TipoMotivo({
  form,
  setForm,
  next,
  back,
  perfiles = [],
}) {
  const safeString = (v) => (typeof v === "string" ? v : "");

  const [perfilSeleccionado, setPerfilSeleccionado] = useState(
    safeString(form.perfilExamen)
  );

  const [estudiosPerfil, setEstudiosPerfil] = useState([]);

  // ✅ ENUMS CORRECTOS
  const motivosExamen = ["ingreso", "egreso", "periodico"];
  const motivosEstudios = ["pendiente", "complementario", "otro"];

  const basicoLey = {
    nombre: "Básico de Ley",
    estudios: [
      "Examen médico",
      "Electrocardiograma",
      "RX tórax",
      "Laboratorio",
    ],
  };

  useEffect(() => {
    if (!perfilSeleccionado || typeof perfilSeleccionado !== "string") {
      setEstudiosPerfil([]);
      return;
    }

    const perfil = perfiles.find((p) => p.nombre === perfilSeleccionado);

    let finales = [];

    if (perfilSeleccionado === "Básico de Ley") {
      finales = basicoLey.estudios;
    } else if (perfil) {
      finales = [...basicoLey.estudios, ...(perfil.estudios || [])];
    }

    setEstudiosPerfil(finales);

    setForm((prev) => ({
      ...prev,
      perfilExamen: perfilSeleccionado,
      listaEstudios: finales,
    }));
  }, [perfilSeleccionado]);

  const estudiosDisponibles = [
    "Audiometría",
    "Espirometría",
    "Laboratorio",
    "Ergometría",
    "RX Columna",
    "RX Tórax",
    "Electrocardiograma",
  ];

  // ✅ VALIDACIÓN CORRECTA
  const puedeSeguir =
    form.tipo &&
    ((form.tipo === "examen" && form.motivo) ||
      (form.tipo === "estudios" &&
        form.motivo &&
        form.listaEstudios?.length > 0));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tipo y Motivo</h2>

      {/* TIPO */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Tipo de turno
        </label>
        <select
          name="tipo"
          className="w-full border rounded-lg px-3 py-2"
          value={form.tipo}
          onChange={(e) =>
            setForm({
              ...form,
              tipo: e.target.value,
              motivo: "",              // ✅ SOLO UNA VEZ
              perfilExamen: "",
              listaEstudios: [],
              estudiosAdicionales: [],
            })
          }
        >
          <option value="">Seleccionar tipo...</option>
          <option value="examen">Examen</option>
          <option value="estudios">Estudios</option>
        </select>
      </div>

      {/* MOTIVO */}
      {form.tipo && (
        <div>
          <label className="block text-sm font-semibold mb-1">Motivo</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.motivo}
            onChange={(e) =>
              setForm({ ...form, motivo: e.target.value })
            }
          >
            <option value="">Seleccionar motivo...</option>

            {(form.tipo === "examen"
              ? motivosExamen
              : motivosEstudios
            ).map((mot, i) => (
              <option key={`mot-${i}`} value={mot}>
                {mot}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* PERFIL */}
      {form.tipo === "examen" && (
        <div>
          <label className="block text-sm font-semibold mb-1">
            Perfil de examen
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={perfilSeleccionado}
            onChange={(e) => {
              const nombre = safeString(e.target.value);
              setPerfilSeleccionado(nombre);
            }}
          >
            <option value="">Seleccionar perfil...</option>
            <option key="basico" value="Básico de Ley">
              Básico de Ley
            </option>

            {perfiles.map((p, i) => (
              <option key={`perfil-${i}`} value={safeString(p.nombre)}>
                {p.nombre}
              </option>
            ))}
          </select>

          {estudiosPerfil.length > 0 && (
            <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
              <p className="font-medium">Incluye:</p>
              <ul className="list-disc pl-5">
                {estudiosPerfil.map((est, i) => (
                  <li key={`estudios-${i}`}>{est}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ESTUDIOS ADICIONALES */}
      {form.tipo === "examen" && (
        <div>
          <label className="block text-sm font-semibold mb-1">
            Estudios adicionales
          </label>

          <EstudiosAdicionalesSelect
            value={form.estudiosAdicionales}
            estudiosDisponibles={estudiosDisponibles}
            onChange={(arr) =>
              setForm({ ...form, estudiosAdicionales: arr })
            }
          />
        </div>
      )}

      {/* ESTUDIOS PARA TIPO “ESTUDIOS” */}
      {form.tipo === "estudios" && (
        <div>
          <label className="block text-sm font-semibold mb-1">
            Lista de estudios
          </label>
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            placeholder="Ej: RX columna, Espirometría..."
            onChange={(e) =>
              setForm({
                ...form,
                listaEstudios: e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter((x) => x),
              })
            }
          />
        </div>
      )}

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          type="button"
          className="border px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
          onClick={back}
        >
          Volver
        </button>

        <button
          type="button"
          className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
            puedeSeguir
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-400 cursor-not-allowed"
          }`}
          disabled={!puedeSeguir}
          onClick={next}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
