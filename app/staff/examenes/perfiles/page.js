
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");



export default function PerfilesPage() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/perfil-examen`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al cargar perfiles");

      const data = await res.json();
      setPerfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando perfiles:", err);
      setPerfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Perfiles de Exámenes
        </h2>

        <Link
          href="/staff/examenes/perfiles/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Nuevo Perfil
        </Link>
      </div>

      {/* LISTADO */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : perfiles.length === 0 ? (
        <p className="text-gray-500">No hay perfiles creados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {perfiles.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow transition"
            >
              <h3 className="font-semibold text-lg mb-1">{p.puesto}</h3>

              <p className="text-sm text-gray-600 mb-2">
                Empresa: {p.empresa?.razonSocial || "—"}
              </p>

              <p className="text-sm mb-3">
                Estudios:{" "}
                {p.estudios?.length
                  ? p.estudios
                      .map((e) => `${e.nombre} (${e.sector})`)
                      .join(", ")
                  : "—"}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    p.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.activo ? "Activo" : "Inactivo"}
                </span>

                <Link
                  href={`/staff/examenes/perfiles/${p._id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
