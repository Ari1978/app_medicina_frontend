"use client";

import { useState } from "react";
import { crearTurno } from "@/app/empresa/api/turnosApi";

// ✅ API dinámico (local + Fly)
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function Paso6Confirmacion({ form, back }) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [turno, setTurno] = useState(null); // ⬅️ guardamos el turno creado

  const enviar = async () => {
    setLoading(true);
    const token = localStorage.getItem("tokenEmpresa");

    try {
      const data = await crearTurno(token, form); // ⬅️ obtenemos turno creado
      setTurno(data); // ⬅️ lo guardamos
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Error al crear turno");
    } finally {
      setLoading(false);
    }
  };

  /** ------------------------------
   *  ÉXITO
   --------------------------------*/
  if (ok) {
    return (
      <div className="text-center space-y-6 py-10">
        <h2 className="text-3xl font-bold text-green-600">
          Turno creado con éxito
        </h2>

        <p className="text-gray-700 text-lg">
          El turno fue registrado correctamente.
        </p>

        <div className="text-sm text-gray-500">
          Ahora podés descargar el comprobante en PDF.
        </div>

        {/* ------------------------------
            BOTÓN DESCARGAR PDF
        ------------------------------ */}
        {turno && (
          <a
            href={`${API_URL}/api/empresa/turnos/${turno._id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition"
          >
            Descargar PDF del turno
          </a>
        )}

        <button
          onClick={() => (window.location.href = "/empresa/dashboard")}
          className="block mx-auto mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow-sm transition"
        >
          Volver al Menú principal
        </button>

        <div className="pt-6 text-gray-400 text-sm">
          Podés reenviar este PDF al empleado por WhatsApp o correo.
        </div>
      </div>
    );
  }

  /** ------------------------------
   *  RESUMEN
   --------------------------------*/
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Confirmar Turno</h2>

      {/* SECCIÓN EMPLEADO */}
      <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">Empleado</h3>
        <p>
          <b>Nombre:</b> {form.empleadoNombre} {form.empleadoApellido}
        </p>
        <p>
          <b>DNI:</b> {form.empleadoDni}
        </p>
        {form.puesto && (
          <p>
            <b>Puesto:</b> {form.puesto}
          </p>
        )}
      </div>

      {/* SECCIÓN TIPO / MOTIVO */}
      <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          Tipo de turno
        </h3>
        <p>
          <b>Tipo:</b> {form.tipo}
        </p>
        <p>
          <b>Motivo:</b> {form.motivo}
        </p>
      </div>

      {/* SECCIÓN PERFIL / ESTUDIOS */}
      {form.tipo === "examen" && (
        <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Perfil del examen
          </h3>
          <p>
            <b>Perfil:</b> {form.perfilExamen}
          </p>

          {form.listaEstudios?.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Estudios incluidos:</p>
              <ul className="list-disc pl-6 text-gray-700">
                {form.listaEstudios.map((e, i) => (
                  <li key={`incluido-${i}`}>{e}</li>
                ))}
              </ul>
            </>
          )}

          {form.estudiosAdicionales?.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Estudios adicionales:</p>
              <ul className="list-disc pl-6 text-gray-700">
                {form.estudiosAdicionales.map((e, i) => (
                  <li key={`adi-${i}`}>{e}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* SECCIÓN ESTUDIOS SI ES "ESTUDIOS" */}
      {form.tipo === "estudios" && (
        <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Estudios solicitados
          </h3>

          <ul className="list-disc pl-6 text-gray-700">
            {form.listaEstudios?.map((e, i) => (
              <li key={`est-${i}`}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SECCIÓN FECHA / HORA */}
      <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          Fecha y Hora
        </h3>
        <p>
          <b>Fecha:</b> {form.fecha}
        </p>
        <p>
          <b>Hora:</b> {form.hora}
        </p>
      </div>

      {/* SECCIÓN SOLICITANTE */}
      <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          Solicitante
        </h3>
        <p>
          <b>Nombre:</b> {form.solicitanteNombre} {form.solicitanteApellido}
        </p>
        <p>
          <b>Celular:</b> {form.solicitanteCelular}
        </p>
      </div>

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          type="button"
          className="border px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
          onClick={back}
          disabled={loading}
        >
          Volver
        </button>

        <button
          type="button"
          onClick={enviar}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition w-full sm:w-auto
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {loading ? "Creando turno..." : "Confirmar Turno"}
        </button>
      </div>
    </div>
  );
}
