
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function EditarPerfil() {
  const router = useRouter();
  const { id } = useParams();

  const [puesto, setPuesto] = useState("");
  const [estudios, setEstudios] = useState([]);

  const [nombre, setNombre] = useState("");
  const [sector, setSector] = useState("");

  const [loading, setLoading] = useState(true);

  // ✅ Cargar perfil
  useEffect(() => {
    if (!id) return;

    const cargarPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/api/perfil-examen/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al cargar perfil");

        const data = await res.json();
        setPuesto(data.puesto || "");
        setEstudios(Array.isArray(data.estudios) ? data.estudios : []);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [id]);

  // ✅ Agregar estudio
  const agregar = () => {
    if (!nombre || !sector) return;

    setEstudios([...estudios, { nombre, sector }]);
    setNombre("");
    setSector("");
  };

  // ✅ Eliminar estudio
  const eliminar = (i) => {
    setEstudios(estudios.filter((_, index) => index !== i));
  };

  // ✅ Guardar cambios
  const guardar = async () => {
    try {
      await fetch(`${API_URL}/api/perfil-examen/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ puesto, estudios }),
      });

      router.push("/staff/examenes/perfiles");
    } catch (err) {
      console.error("Error al guardar perfil:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-gray-600">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>

      <input
        value={puesto}
        onChange={(e) => setPuesto(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Puesto"
      />

      <div className="flex gap-2 mb-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-3 py-2 flex-1"
          placeholder="Estudio"
        />
        <input
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="border px-3 py-2 flex-1"
          placeholder="Sector"
        />
        <button
          onClick={agregar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
        >
          +
        </button>
      </div>

      <ul className="mb-4">
        {estudios.map((e, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 px-3 py-1 mb-1 rounded"
          >
            <span>
              {e.nombre} ({e.sector})
            </span>
            <button
              onClick={() => eliminar(i)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
