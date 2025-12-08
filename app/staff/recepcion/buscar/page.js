"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BuscarTurno() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/recepcion/buscar?query=${encodeURIComponent(query)}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Error en la búsqueda");

      const data = await res.json();
      setResultados(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error buscando turno:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 rounded"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <pre className="bg-white p-4 rounded shadow overflow-x-auto text-sm">
        {JSON.stringify(resultados, null, 2)}
      </pre>
    </div>
  );
}
