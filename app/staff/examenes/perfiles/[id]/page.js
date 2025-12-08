
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarPerfil() {
  const router = useRouter();
  const { id } = useParams();

  const [puesto, setPuesto] = useState("");
  const [estudios, setEstudios] = useState([]);

  const [nombre, setNombre] = useState("");
  const [sector, setSector] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/api/perfil-examen/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPuesto(data.puesto);
        setEstudios(data.estudios || []);
      });
  }, [id]);

  const agregar = () => {
    if (!nombre || !sector) return;

    setEstudios([...estudios, { nombre, sector }]);
    setNombre("");
    setSector("");
  };

  const eliminar = (i) => {
    setEstudios(estudios.filter((_, index) => index !== i));
  };

  const guardar = async () => {
    await fetch(`http://localhost:4000/api/perfil-examen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ puesto, estudios }),
    });

    router.push("/staff/examenes/perfiles");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>

      <input
        value={puesto}
        onChange={(e) => setPuesto(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
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
        <button onClick={agregar} className="bg-blue-600 text-white px-4">
          +
        </button>
      </div>

      <ul className="mb-4">
        {estudios.map((e, i) => (
          <li
            key={i}
            className="flex justify-between bg-gray-100 px-3 py-1 mb-1"
          >
            {e.nombre} ({e.sector})
            <button onClick={() => eliminar(i)} className="text-red-600">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="bg-green-600 text-white px-6 py-2"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
