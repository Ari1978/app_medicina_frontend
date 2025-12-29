"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function EditarPerfil() {
  const router = useRouter();
  const { id } = useParams();

  const [puesto, setPuesto] = useState("");
  const [catalogoPracticas, setCatalogoPracticas] = useState([]);
  const [practicas, setPracticas] = useState([]); // [{ codigo }]

  const [loading, setLoading] = useState(true);

  // =========================
  // CARGAR CATÁLOGO DE PRÁCTICAS
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/practicas/catalogo`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setCatalogoPracticas(Array.isArray(d) ? d : []))
      .catch(() => setCatalogoPracticas([]));
  }, []);

  // =========================
  // CARGAR PERFIL
  // =========================
  useEffect(() => {
    if (!id) return;

    const cargarPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/api/perfil-examen/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setPuesto(data.puesto || "");

        // 🔑 practicas → [{ codigo }]
        setPracticas(
          Array.isArray(data.practicas)
            ? data.practicas.map((p) => ({
                codigo: String(p.codigo),
              }))
            : []
        );
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [id]);

  // =========================
  // AGREGAR / ELIMINAR PRÁCTICA
  // =========================
  const agregarPractica = (codigo) => {
    if (!codigo) return;
    if (practicas.some((p) => p.codigo === codigo)) return;

    setPracticas((prev) => [...prev, { codigo }]);
  };

  const eliminarPractica = (codigo) => {
    setPracticas((prev) =>
      prev.filter((p) => p.codigo !== codigo)
    );
  };

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/perfil-examen/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          puesto,
          practicas, // ✅ [{ codigo }]
        }),
      });

      if (!res.ok) throw new Error();

      router.push("/staff/examenes/perfiles");
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      alert("No se pudo guardar el perfil");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-gray-600">
        Cargando perfil...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-2xl font-bold">Editar Perfil</h2>

      <input
        value={puesto}
        onChange={(e) => setPuesto(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="Puesto"
      />

      <select
        className="w-full border rounded px-3 py-2"
        onChange={(e) => agregarPractica(e.target.value)}
      >
        <option value="">Agregar práctica...</option>
        {catalogoPracticas.map((p) => (
          <option key={p.codigo} value={p.codigo}>
            [{p.codigo}] {p.nombre} ({p.sector})
          </option>
        ))}
      </select>

      <ul className="space-y-1">
        {practicas.map((p) => {
          const meta = catalogoPracticas.find(
            (x) => x.codigo === p.codigo
          );

          return (
            <li
              key={p.codigo}
              className="flex justify-between bg-gray-100 px-3 py-1 rounded"
            >
              <span>
                [{p.codigo}] {meta?.nombre} ({meta?.sector})
              </span>
              <button
                onClick={() => eliminarPractica(p.codigo)}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 rounded"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
