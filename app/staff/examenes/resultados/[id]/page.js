"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function CargarResultadoFinalPage() {
  const { id } = useParams();
  const router = useRouter();

  const [turno, setTurno] = useState(null);
  const [aptitud, setAptitud] = useState("A");
  const [observacionGeneral, setObservacionGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false); // ✅ mensaje éxito

  // =========================
  // CARGAR TURNO
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/staff/turnos/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTurno(data);

        if (data.resultadoFinal) {
          setAptitud(data.resultadoFinal.aptitud);
          setObservacionGeneral(
            data.resultadoFinal.observacionGeneral || ""
          );
        }
      });
  }, [id]);

  if (!turno) {
    return <p className="text-gray-500">Cargando turno…</p>;
  }

  const puedeEditar = turno.estado === "confirmado";
  const esRealizado = turno.estado === "realizado";

  // =========================
  // AUTO-RESIZE TEXTAREA
  // =========================
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // =========================
  // GUARDAR RESULTADO
  // =========================
  const guardarResultado = async () => {
    if (!puedeEditar || guardando) return;

    setGuardando(true);

    const payload = {
      estudios: (turno.estudios || []).map((e) => ({
        nombre: e.nombre,
        sector: e.sector,
        estado: "realizado",
        resumen: e.resumen || "",
      })),
      aptitud,
      observacionGeneral,
    };

    try {
      const res = await fetch(
        `${API_URL}/api/staff/turnos/${id}/resultado-final`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al guardar resultado");
        return;
      }

      // ✅ marcar éxito y pasar a modo lectura
      setOk(true);
      setTurno({ ...turno, estado: "realizado" });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* =========================
          MENSAJES
      ========================= */}
      {turno.estado === "provisional" && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
          El turno aún no está confirmado. No se puede cargar el resultado.
        </div>
      )}

      {esRealizado && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
          Este turno ya fue realizado. El informe se muestra en modo lectura.
        </div>
      )}

      {ok && (
        <div className="p-4 bg-green-100 border border-green-300 rounded text-green-800">
          ✅ Informe cargado con éxito.
        </div>
      )}

      {/* =========================
          DATOS DEL TURNO
      ========================= */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Empresa:</span>{" "}
          {turno.empresa?.razonSocial}
        </p>

        <p className="text-xl font-bold">
          {turno.empleadoApellido}, {turno.empleadoNombre}
        </p>

        <p className="text-sm text-gray-700">
          DNI {turno.empleadoDni} · Puesto: {turno.puesto}
        </p>

        <p className="text-sm text-gray-500">
          Fecha {turno.fecha} · Hora {turno.hora}
        </p>
      </div>

      {/* =========================
          ESTUDIOS
      ========================= */}
      <div className="space-y-6">
        {(turno.estudios || []).map((e, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white space-y-2">
            <p className="font-semibold text-gray-800">
              {e.nombre}{" "}
              <span className="text-sm text-gray-500">
                ({e.sector})
              </span>
            </p>

            <textarea
              className="w-full border rounded-md p-3 text-sm resize-none overflow-hidden"
              placeholder="Resumen del estudio"
              value={e.resumen || ""}
              disabled={!puedeEditar}
              onInput={autoResize}
              onChange={(ev) => {
                const copia = [...turno.estudios];
                copia[i] = { ...copia[i], resumen: ev.target.value };
                setTurno({ ...turno, estudios: copia });
              }}
              style={{ minHeight: "120px" }}
            />
          </div>
        ))}
      </div>

      {/* =========================
          APTITUD
      ========================= */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">
          Aptitud final
        </label>

        <select
          className="border rounded px-4 py-2 w-full max-w-md"
          value={aptitud}
          disabled={!puedeEditar}
          onChange={(e) => setAptitud(e.target.value)}
        >
          <option value="A">A – Apto sin observaciones</option>
          <option value="B">B – Apto con observaciones</option>
          <option value="C">C – No apto</option>
        </select>
      </div>

      {/* =========================
          OBSERVACIÓN GENERAL
      ========================= */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">
          Observación general
        </label>

        <textarea
          className="w-full border rounded-md p-3 resize-none overflow-hidden"
          placeholder="Conclusión médica"
          value={observacionGeneral}
          disabled={!puedeEditar}
          onInput={autoResize}
          onChange={(e) => setObservacionGeneral(e.target.value)}
          style={{ minHeight: "160px" }}
        />
      </div>

      {/* =========================
          ACCIONES
      ========================= */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push("/staff/examenes/resultados")}
          className="px-6 py-2 rounded border"
        >
          Volver
        </button>

        {puedeEditar && (
          <button
            onClick={guardarResultado}
            disabled={guardando}
            className="px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
          >
            {guardando ? "Guardando..." : "Guardar resultado"}
          </button>
        )}
      </div>
    </div>
  );
}
