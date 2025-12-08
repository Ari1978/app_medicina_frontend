"use client";

import { useState } from "react";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");



export default function ImportarEmpresasPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Seleccioná un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch(
        `${API_URL}/api/superadmin/empresas/import`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al importar");
        return;
      }

      setResultado(data);
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4 max-w-xl">
      <h2 className="text-xl font-bold">Importar Empresas por Excel</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
        >
          {loading ? "Importando..." : "Importar"}
        </button>
      </form>

      {resultado && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded space-y-1">
          <p>
            <b>{resultado.message}</b>
          </p>
          <p>Insertadas: {resultado.insertadas}</p>
          <p>Omitidas: {resultado.omitidas}</p>
          <p>Total: {resultado.total}</p>
        </div>
      )}
    </div>
  );
}
