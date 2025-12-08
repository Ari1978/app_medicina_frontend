"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");


const ESTUDIOS_DISPONIBLES = [
  { nombre: "Laboratorio", sector: "Laboratorio" },
  { nombre: "Electrocardiograma", sector: "Cardiología" },
  { nombre: "Ergometría", sector: "Cardiología" },
  { nombre: "RX Tórax", sector: "Rayos" },
  { nombre: "RX Columna", sector: "Rayos" },
  { nombre: "Audiometría", sector: "Fonoaudiología" },
  { nombre: "Espirometría", sector: "Neumonología" },
];

export default function NuevoPerfilPage() {
  const router = useRouter();

  const [puesto, setPuesto] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [empresas, setEmpresas] = useState([]);

  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Cargar empresas (local + producción)
  useEffect(() => {
    async function cargarEmpresas() {
      try {
        const res = await fetch(`${API_URL}/api/empresa`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error cargando empresas");

        const data = await res.json();
        setEmpresas(
          Array.isArray(data) ? data : data?.empresas || data?.data || []
        );
      } catch (err) {
        console.error("Error cargando empresas:", err);
        setEmpresas([]);
      }
    }

    cargarEmpresas();
  }, []);

  // ✅ Agregar estudio desde selector (sin duplicados)
  const agregarEstudio = (nombre) => {
    const seleccionado = ESTUDIOS_DISPONIBLES.find(
      (x) => x.nombre === nombre
    );

    if (!seleccionado) return;
    if (estudios.some((x) => x.nombre === seleccionado.nombre)) return;

    setEstudios([...estudios, seleccionado]);
  };

  // ✅ Eliminar estudio
  const eliminarEstudio = (index) => {
    setEstudios(estudios.filter((_, i) => i !== index));
  };

  // ✅ Guardar perfil
  const guardar = async () => {
    if (!puesto || !empresaId || estudios.length === 0) {
      alert("Completá todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/perfil-examen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          puesto,
          estudios,
          empresaId,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      router.push("/staff/examenes/perfiles");
    } catch (err) {
      console.error("Error creando perfil:", err.message);
      alert("Error al crear perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Nuevo Perfil de Examen</h2>

      {/* PUESTO */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Puesto</label>
        <input
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: Administrativo"
        />
      </div>

      {/* EMPRESA */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Empresa</label>
        <select
          value={empresaId}
          onChange={(e) => setEmpresaId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Seleccionar empresa...</option>
          {Array.isArray(empresas) &&
            empresas.map((e) => (
              <option key={e._id} value={e._id}>
                {e.razonSocial}
              </option>
            ))}
        </select>
      </div>

      {/* ESTUDIOS */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Estudios del perfil
        </label>

        <select
          className="w-full border rounded px-3 py-2 mb-3"
          onChange={(e) => agregarEstudio(e.target.value)}
        >
          <option value="">Seleccionar estudio...</option>
          {ESTUDIOS_DISPONIBLES.map((e) => (
            <option key={e.nombre} value={e.nombre}>
              {e.nombre} ({e.sector})
            </option>
          ))}
        </select>

        <ul className="space-y-1 text-sm">
          {estudios.map((e, i) => (
            <li
              key={i}
              className="flex justify-between bg-gray-100 px-3 py-1 rounded"
            >
              <span>
                {e.nombre} ({e.sector})
              </span>
              <button
                onClick={() => eliminarEstudio(i)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* BOTONES */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar Perfil"}
        </button>
      </div>
    </div>
  );
}
