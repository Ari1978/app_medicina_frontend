
"use client";

import { useState } from "react";

export default function BuscarTurno() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);

  const buscar = async () => {
    const res = await fetch(
      `http://localhost:4000/api/recepcion/buscar?query=${query}`,
      { credentials: "include" }
    );
    const data = await res.json();
    setResultados(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Buscar Turno</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="DNI, empresa o fecha"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Buscar
        </button>
      </div>

      <pre className="bg-white p-4 rounded shadow">
        {JSON.stringify(resultados, null, 2)}
      </pre>
    </div>
  );
}
