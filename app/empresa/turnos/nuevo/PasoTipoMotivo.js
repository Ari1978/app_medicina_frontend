"use client";

import { useEffect, useState } from "react";
import EstudiosAdicionalesSelect from "../../../components/EstudiosAdicionalesSelect";

export default function Paso2TipoMotivo({
  form,
  setForm,
  next,
  back,
  perfiles = [],
  catalogoEstudios = [],
}) {
  const [estudiosPerfil, setEstudiosPerfil] = useState([]);

  const motivosExamen = ["ingreso", "periodico", "egreso"];
  const motivosEstudios = ["pendiente", "complementario", "otro"];

  const perfilesFiltrados =
    form.tipo === "examen" && form.motivo
      ? perfiles.filter(
          (p) =>
            String(p.tipo).toLowerCase() ===
            String(form.motivo).toLowerCase()
        )
      : [];

  // =========================================================
  // CUANDO SE SELECCIONA UN PERFIL (SOLO EXAMEN)
  // =========================================================
  useEffect(() => {
    if (form.tipo !== "examen" || !form.perfilExamen) {
      setEstudiosPerfil([]);
      setForm((prev) => ({
        ...prev,
        listaEstudios: [],
      }));
      return;
    }

    const perfil = perfiles.find((p) => p._id === form.perfilExamen);

    if (!perfil || !Array.isArray(perfil.practicas)) {
      setEstudiosPerfil([]);
      return;
    }

    setEstudiosPerfil(perfil.practicas);

    setForm((prev) => ({
      ...prev,
      listaEstudios: perfil.practicas.map((p) => ({
        codigo: String(p.codigo),
        estado: "pendiente",
      })),
      estudiosAdicionales: [],
    }));
  }, [form.perfilExamen, form.tipo, perfiles, setForm]);

  // =========================================================
  // VALIDACIÓN PARA CONTINUAR
  // =========================================================
  const puedeSeguir =
    form.tipo &&
    form.motivo &&
    (form.tipo === "estudios" || form.listaEstudios.length > 0);

  // =========================================================
  // FILTRADO DE PRÁCTICAS DISPONIBLES
  // =========================================================
  const codigosBase = (form.listaEstudios || []).map((e) =>
    String(e.codigo)
  );

  const estudiosDisponiblesFiltrados = catalogoEstudios.filter(
    (e) => !codigosBase.includes(String(e.codigo))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tipo y Motivo</h2>

      {/* ================= TIPO ================= */}
      <select
        className="w-full border rounded-lg px-3 py-2"
        value={form.tipo}
        onChange={(e) =>
          setForm({
            ...form,
            tipo: e.target.value,
            motivo: "",
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

      {/* ================= MOTIVO ================= */}
      {form.tipo && (
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={form.motivo}
          onChange={(e) =>
            setForm({
              ...form,
              motivo: e.target.value,
              perfilExamen: "",
              listaEstudios: [],
              estudiosAdicionales: [],
            })
          }
        >
          <option value="">Seleccionar motivo...</option>
          {(form.tipo === "examen"
            ? motivosExamen
            : motivosEstudios
          ).map((mot) => (
            <option key={mot} value={mot}>
              {mot}
            </option>
          ))}
        </select>
      )}

      {/* ================= PERFIL (SOLO EXAMEN) ================= */}
      {form.tipo === "examen" && form.motivo && (
        <>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.perfilExamen}
            onChange={(e) =>
              setForm({ ...form, perfilExamen: e.target.value })
            }
          >
            <option value="">Seleccionar perfil...</option>
            {perfilesFiltrados.map((p) => (
              <option key={p._id} value={p._id}>
                {p.puesto}
              </option>
            ))}
          </select>

          {/* PRÁCTICAS DEL PERFIL */}
          {estudiosPerfil.length > 0 && (
            <ul className="bg-gray-100 p-3 rounded text-sm space-y-1">
              {estudiosPerfil.map((p) => (
                <li key={p.codigo}>
                  {p.nombre} ({p.sector})
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* ================= PRÁCTICAS (EXAMEN Y ESTUDIOS) ================= */}
      {(form.tipo === "examen" || form.tipo === "estudios") && (
        <EstudiosAdicionalesSelect
  value={
    form.tipo === "estudios"
      ? (form.listaPracticas || []).map((p) => p.codigo)
      : form.estudiosAdicionales
  }
  estudiosDisponibles={estudiosDisponiblesFiltrados}
  onChange={(ids) =>
    setForm((prev) => {
      if (prev.tipo === "estudios") {
        return {
          ...prev,
          listaPracticas: ids.map((codigo) => ({
            codigo: String(codigo),
            estado: "pendiente",
          })),
        };
      }

      // EXAMEN (se mantiene como estaba)
      return {
        ...prev,
        estudiosAdicionales: ids,
      };
    })
  }
/>

      )}

      <button
        disabled={!puedeSeguir}
        onClick={next}
        className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}
