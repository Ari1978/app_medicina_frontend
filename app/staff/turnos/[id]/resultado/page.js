"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function EditarResultado() {
  const { id } = useParams();
  const router = useRouter();

  const [turno, setTurno] = useState(null);
  const [aptitud, setAptitud] = useState("A");
  const [observacionGeneral, setObservacionGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // =========================
  // CARGAR TURNO
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/staff/turnos/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setTurno(data);

        if (data.resultadoFinal) {
          setAptitud(data.resultadoFinal.aptitud);
          setObservacionGeneral(
            data.resultadoFinal.observacionGeneral || ""
          );
        }
      });
  }, [id]);

  // =========================
  // AUTOSIZE TEXTAREA
  // =========================
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // =========================
  // GUARDAR CAMBIOS
  // =========================
  const guardar = async () => {
    if (!turno || guardando) return;

    setGuardando(true);
    setMensaje("");

    const payload = {
      estudios: (turno.resultadoFinal?.estudios || turno.estudios || []).map(
        (e) => ({
          nombre: e.nombre,
          sector: e.sector,
          estado: "realizado",
          resumen: e.resumen || "",
        })
      ),
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

      setMensaje("✅ Informe actualizado correctamente");

      setTimeout(() => {
        router.push("/staff/examenes/ver-editar-resultados");
      }, 1200);
    } finally {
      setGuardando(false);
    }
  };

  if (!turno) {
    return <p className="text-gray-500">Cargando resultado…</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">
        Ver / Editar Resultado Final
      </h1>

      {/* MENSAJE */}
      {mensaje && (
        <div className="p-3 rounded bg-green-100 text-green-800 border border-green-200">
          {mensaje}
        </div>
      )}

      {/* DATOS */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-1">
        <p className="font-semibold">
          {turno.empleadoApellido}, {turno.empleadoNombre}
        </p>
        <p className="text-sm text-gray-600">
          DNI {turno.empleadoDni} · {turno.fecha} {turno.hora}
        </p>
        <p className="text-sm text-gray-600">
          Empresa: {turno.empresa?.razonSocial}
        </p>
      </div>

      {/* APTITUD */}
      <div>
        <label className="block font-medium mb-1">
          Aptitud final
        </label>
        <select
          className="border rounded-md p-2 w-full"
          value={aptitud}
          onChange={e => setAptitud(e.target.value)}
        >
          <option value="A">A – Apto</option>
          <option value="B">B – Apto condicionado</option>
          <option value="C">C – No apto</option>
        </select>
      </div>

      {/* OBSERVACIÓN */}
      <div>
        <label className="block font-medium mb-1">
          Observación general
        </label>
        <textarea
          className="w-full border rounded-md p-3 resize-none overflow-hidden"
          placeholder="Conclusión médica general"
          value={observacionGeneral}
          onInput={autoResize}
          onChange={e => setObservacionGeneral(e.target.value)}
          style={{ minHeight: "180px" }}
        />
      </div>

      {/* ACCIONES */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          disabled={guardando}
          className={`px-5 py-2 rounded-md text-white font-semibold ${
            guardando
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
