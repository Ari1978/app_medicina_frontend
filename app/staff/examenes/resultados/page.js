"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function ResultadosStaffPage() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [turnos, setTurnos] = useState([]);

  // =========================
  // EMPRESAS CON TURNOS CONFIRMADOS
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/staff/turnos/empresas-con-examenes`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(toArray(data)))
      .catch(() => setEmpresas([]));
  }, []);

  // =========================
  // TURNOS CONFIRMADOS POR EMPRESA
  // =========================
  useEffect(() => {
    if (!empresaId) {
      setTurnos([]);
      return;
    }

    fetch(
      `${API_URL}/api/staff/turnos/confirmados/empresa/${empresaId}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setTurnos(toArray(data)))
      .catch(() => setTurnos([]));
  }, [empresaId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Carga de Resultados</h1>

      {/* SELECT EMPRESA */}
      <select
        className="border px-4 py-2 rounded w-full max-w-md"
        value={empresaId}
        onChange={(e) => setEmpresaId(e.target.value)}
      >
        <option value="">Seleccionar empresa</option>
        {empresas.map((e) => (
          <option key={e._id} value={e._id}>
            {e.razonSocial}
          </option>
        ))}
      </select>

      {/* LISTA DE TURNOS */}
      {turnos.length > 0 && (
        <div className="grid gap-4">
          {turnos.map((t) => {
            const tieneResultado = !!t.resultadoFinal;

            return (
              <div
                key={t._id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {t.empleadoApellido}, {t.empleadoNombre}
                  </p>

                  <p className="text-sm text-gray-600">
                    DNI {t.empleadoDni} · {t.fecha} {t.hora}
                  </p>

                  <p className="text-sm text-gray-500">
                    Puesto: {t.puesto} · Tipo: {t.tipo}
                  </p>

                  {tieneResultado && (
                    <p className="text-sm text-green-600 font-medium">
                      ✔ Informe cargado
                    </p>
                  )}
                </div>

                <Link
                  href={`/staff/examenes/resultados/${t._id}`}
                  className={`px-4 py-2 rounded text-white ${
                    tieneResultado
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {tieneResultado
                    ? "Editar resultado"
                    : "Cargar resultado"}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {empresaId && turnos.length === 0 && (
        <p className="text-gray-500">
          No hay turnos confirmados para esta empresa.
        </p>
      )}
    </div>
  );
}
