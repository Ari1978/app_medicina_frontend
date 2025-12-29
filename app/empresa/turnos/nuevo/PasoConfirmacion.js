"use client";

import { useState } from "react";
import { crearTurno } from "@/app/empresa/api/turnosApi";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function Paso6Confirmacion({
  form,
  back,
  catalogoEstudios = [],
}) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [turno, setTurno] = useState(null);

  // =========================
  // CATALOGO CARGADO
  // =========================
  const catalogoCargado =
    Array.isArray(catalogoEstudios) && catalogoEstudios.length > 0;

  // =========================
  // RESOLVER ESTUDIOS PERFIL (EXAMEN)
  // =========================
  const estudiosPerfil = catalogoCargado
    ? (form.listaEstudios || [])
        .map((item) => {
          if (item?.codigo) {
            return catalogoEstudios.find(
              (c) => String(c.codigo) === String(item.codigo)
            );
          }

          if (item?.nombre && item?.sector) {
            return catalogoEstudios.find(
              (c) => c.nombre === item.nombre && c.sector === item.sector
            );
          }

          return null;
        })
        .filter(Boolean)
    : [];

  // =========================
  // ESTUDIOS ADICIONALES (EXAMEN)
  // =========================
  const estudiosAdicionales = catalogoCargado
    ? (form.estudiosAdicionales || [])
        .map((codigo) =>
          catalogoEstudios.find((c) => String(c.codigo) === String(codigo))
        )
        .filter(Boolean)
    : [];

  // =========================
  // PRACTICAS (ESTUDIOS)
  // =========================
  const practicasEstudios = catalogoCargado
    ? (form.listaPracticas || [])
        .map((item) =>
          catalogoEstudios.find(
            (c) => String(c.codigo) === String(item.codigo)
          )
        )
        .filter(Boolean)
    : [];

  // =========================
  // ENVIAR TURNO
  // =========================
  const enviar = async () => {
    setLoading(true);

    try {
      const payload = {
        empleadoNombre: form.empleadoNombre,
        empleadoApellido: form.empleadoApellido,
        empleadoDni: form.empleadoDni,
        puesto: form.puesto,

        tipo: form.tipo,
        motivo: form.motivo,
        perfilExamen: form.perfilExamen || null,

        fecha: form.fecha,
        hora: form.hora,

        solicitanteNombre: form.solicitanteNombre,
        solicitanteApellido: form.solicitanteApellido,
        solicitanteCelular: form.solicitanteCelular,

        // backend espera CODIGO
        listaPracticas: [
          ...(form.listaPracticas || []),
          ...(form.estudiosAdicionales || []).map((codigo) => ({
            codigo,
            estado: "pendiente",
          })),
        ],
      };

      const data = await crearTurno(payload);
      setTurno(data);
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Error al crear turno");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ÉXITO
  // =========================
  if (ok) {
    return (
      <div className="text-center space-y-6 py-10">
        <h2 className="text-3xl font-bold text-green-600">
          Turno creado con éxito
        </h2>

        <p className="text-gray-700">El turno fue registrado correctamente.</p>

        {turno?._id && (
          <a
            href={`${API_URL}/api/empresa/turnos/${turno._id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Descargar PDF del turno
          </a>
        )}

        <button
          onClick={() => (window.location.href = "/empresa/dashboard")}
          className="block mx-auto mt-6 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold"
        >
          Volver al menú principal
        </button>
      </div>
    );
  }

  // =========================
  // CONFIRMACIÓN
  // =========================
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Confirmar Turno</h2>

      {/* EMPLEADO */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p>
          <b>Empleado:</b> {form.empleadoNombre} {form.empleadoApellido}
        </p>
        <p>
          <b>DNI:</b> {form.empleadoDni}
        </p>
        <p>
          <b>Puesto:</b> {form.puesto}
        </p>
      </div>

      {/* TIPO */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p>
          <b>Tipo:</b> {form.tipo}
        </p>
        <p>
          <b>Motivo:</b> {form.motivo}
        </p>
      </div>

      {/* EXAMEN */}
      {form.tipo === "examen" && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2">Estudios incluidos</p>

          {!catalogoCargado && (
            <p className="text-sm text-gray-500">Cargando estudios…</p>
          )}

          {catalogoCargado && (
            <ul className="list-disc pl-6 text-sm space-y-1">
              {estudiosPerfil.map((e, idx) => (
                <li key={`perfil-${e.codigo}-${idx}`}>
                  {e.nombre} ({e.sector})
                </li>
              ))}

              {estudiosAdicionales.map((e) => (
                <li key={`extra-${e.codigo}`}>
                  {e.nombre} ({e.sector}){" "}
                  <span className="text-xs text-gray-500">(adicional)</span>
                </li>
              ))}

              {estudiosPerfil.length === 0 &&
                estudiosAdicionales.length === 0 && (
                  <li className="text-gray-500">No hay estudios asignados</li>
                )}
            </ul>
          )}
        </div>
      )}

      {/* ESTUDIOS */}
      {form.tipo === "estudios" && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2">Prácticas solicitadas</p>

          {!catalogoCargado && (
            <p className="text-sm text-gray-500">Cargando prácticas…</p>
          )}

          {catalogoCargado && (
            <ul className="list-disc pl-6 text-sm space-y-1">
              {practicasEstudios.map((p) => (
                <li key={`practica-${p.codigo}`}>
                  {p.nombre} ({p.sector})
                </li>
              ))}

              {practicasEstudios.length === 0 && (
                <li className="text-gray-500">No hay prácticas asignadas</li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* FECHA */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p>
          <b>Fecha:</b> {form.fecha}
        </p>
        <p>
          <b>Hora:</b> {form.hora}
        </p>
      </div>

      {/* SOLICITANTE */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p>
          <b>Solicitante:</b> {form.solicitanteNombre}{" "}
          {form.solicitanteApellido}
        </p>
        <p>
          <b>Celular:</b> {form.solicitanteCelular}
        </p>
      </div>

      {/* BOTONES */}
      <div className="flex justify-between gap-3 pt-4">
        <button onClick={back} className="border px-6 py-3 rounded-lg">
          Volver
        </button>

        <button
          onClick={enviar}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Creando turno..." : "Confirmar turno"}
        </button>
      </div>
    </div>
  );
}
