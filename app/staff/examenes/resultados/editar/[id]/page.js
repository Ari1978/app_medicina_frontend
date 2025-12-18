"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// ==============================
// TEXTAREA AUTO-GROW
// ==============================
function AutoGrowTextarea({ value, onChange, placeholder = "", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={`resize-none overflow-hidden ${className}`}
    />
  );
}

export default function EditarResultadoFinalPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [aptitud, setAptitud] = useState("");
  const [observacionGeneral, setObservacionGeneral] = useState("");
  const [estudios, setEstudios] = useState([]);

  const [esEdicion, setEsEdicion] = useState(false);

  // ---------------------------------------
  // CARGA INICIAL
  // ---------------------------------------
  useEffect(() => {
    const fetchTurno = async () => {
      try {
        const res = await fetch(`${API_URL}/api/staff/turnos/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al cargar el turno");

        const data = await res.json();

        if (data.resultadoFinal) {
          setEsEdicion(true);
          setAptitud(data.resultadoFinal.aptitud || "");
          setObservacionGeneral(
            data.resultadoFinal.observacionGeneral || ""
          );
          setEstudios(data.resultadoFinal.estudios || []);
        } else {
          setEsEdicion(false);
          setEstudios(data.estudios || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurno();
  }, [id]);

  // ---------------------------------------
  // GUARDAR
  // ---------------------------------------
  const guardarCambios = async () => {
    setSaving(true);
    setError("");

    try {
      const estudiosAdaptados = estudios.map((e) => ({
        nombre: e.nombre,
        sector: e.sector || "General",
        estado: "realizado",
        resumen: e.observacion || e.resultado || "",
      }));

      const endpoint = esEdicion
        ? `${API_URL}/api/staff/turnos/${id}/resultado-final/editar`
        : `${API_URL}/api/staff/turnos/${id}/resultado-final`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aptitud,
          observacionGeneral,
          estudios: estudiosAdaptados,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al guardar");
      }

      alert("✅ Informe guardado con éxito");
      router.back();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  if (loading) return <p className="p-6">Cargando...</p>;

  if (error)
    return (
      <div className="p-6 text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="rounded-lg bg-yellow-100 border border-yellow-300 p-4">
        <p className="font-semibold text-yellow-800">
          {esEdicion ? "Editando informe" : "Cargando nuevo informe"}
        </p>
      </div>

      {/* APTITUD */}
      <div className="space-y-2">
        <label className="font-medium">Aptitud</label>
        <select
          value={aptitud}
          onChange={(e) => setAptitud(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Seleccionar</option>
          <option value="A">Apto</option>
          <option value="B">Apto con observaciones</option>
          <option value="C">No apto</option>
        </select>
      </div>

      {/* OBSERVACIÓN GENERAL */}
      <div className="space-y-2">
        <label className="font-medium">Observación general</label>
        <AutoGrowTextarea
          value={observacionGeneral}
          onChange={(e) => setObservacionGeneral(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* ESTUDIOS */}
      {estudios.map((est, index) => (
        <div key={index} className="border rounded p-4 space-y-2">
          <p className="font-semibold">{est.nombre}</p>

          <input
            value={est.resultado || ""}
            onChange={(e) => {
              const copy = [...estudios];
              copy[index].resultado = e.target.value;
              setEstudios(copy);
            }}
            className="w-full border rounded p-2"
            placeholder="Resultado"
          />

          <AutoGrowTextarea
            value={est.observacion || ""}
            onChange={(e) => {
              const copy = [...estudios];
              copy[index].observacion = e.target.value;
              setEstudios(copy);
            }}
            className="w-full border rounded p-2"
            placeholder="Observación"
          />
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={guardarCambios}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Guardar
        </button>

        <button
          onClick={() => router.back()}
          className="border px-6 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
