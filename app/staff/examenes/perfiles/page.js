"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Solo producción (Fly.io)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function PerfilesPage() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Filtros
  const [buscarPuesto, setBuscarPuesto] = useState("");
  const [buscarEmpresa, setBuscarEmpresa] = useState("");
  const [buscarCliente, setBuscarCliente] = useState("");

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

  // 🗑 Eliminar perfil
  const eliminarPerfil = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este perfil?")) return;

    try {
      const res = await fetch(`${API_URL}/api/perfil-examen/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar perfil");

      cargar();
    } catch (err) {
      alert("No se pudo eliminar el perfil");
    }
  };

  // ===================================================
  // FILTROS PROFESIONALES
  // ===================================================
  const perfilesFiltrados = perfiles.filter((p) => {
    const empresaNombre = p.empresa?.razonSocial || "";
    const clienteNum = p.empresa?.numeroCliente?.toString() || "";

    const matchPuesto = p.puesto
      .toLowerCase()
      .includes(buscarPuesto.toLowerCase());

    const matchEmpresa = empresaNombre
      .toLowerCase()
      .includes(buscarEmpresa.toLowerCase());

    const matchCliente = clienteNum.includes(buscarCliente);

    return matchPuesto && matchEmpresa && matchCliente;
  });

  // Empresas únicas para el selector
  const empresasUnicas = [
    ...new Set(
      perfiles
        .map((p) => p.empresa?.razonSocial)
        .filter((x) => x)
    ),
  ];

  // Agrupar por empresa
  const perfilesPorEmpresa = perfilesFiltrados.reduce((acc, perfil) => {
    const empresa = perfil.empresa?.razonSocial || "Sin empresa";
    if (!acc[empresa]) acc[empresa] = [];
    acc[empresa].push(perfil);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Perfiles de Exámenes</h2>

        <Link
          href="/staff/examenes/perfiles/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Nuevo Perfil
        </Link>
      </div>

      {/* 🔍 FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por puesto..."
          className="border rounded-lg px-4 py-2"
          value={buscarPuesto}
          onChange={(e) => setBuscarPuesto(e.target.value)}
        />

        <input
          type="text"
          placeholder="Buscar por empresa..."
          className="border rounded-lg px-4 py-2"
          value={buscarEmpresa}
          onChange={(e) => setBuscarEmpresa(e.target.value)}
        />

        <input
          type="number"
          placeholder="Número de cliente..."
          className="border rounded-lg px-4 py-2"
          value={buscarCliente}
          onChange={(e) => setBuscarCliente(e.target.value)}
        />

        <button
          onClick={() => {
            setBuscarPuesto("");
            setBuscarEmpresa("");
            setBuscarCliente("");
          }}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Limpiar filtros
        </button>
      </div>

      {/* ESTADOS */}
      {loading && <p className="text-gray-500">Cargando perfiles...</p>}

      {!loading && perfilesFiltrados.length === 0 && (
        <p className="text-gray-500">No hay perfiles con esos filtros.</p>
      )}

      {/* LISTADO AGRUPADO */}
      {!loading &&
        Object.entries(perfilesPorEmpresa).map(([empresa, lista]) => (
          <div key={empresa} className="space-y-4">
            {/* Encabezado empresa */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-700">
                {empresa}
              </h3>

              <span className="text-sm text-gray-500">
                Cliente Nº {lista[0].empresa?.numeroCliente || "—"}
              </span>
            </div>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lista.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow transition"
                >
                  <h4 className="font-semibold text-lg mb-1">{p.puesto}</h4>

                  <p className="text-sm text-gray-700 mb-3">
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

                    <div className="flex gap-4 text-sm">
                      <Link
                        href={`/staff/examenes/perfiles/${p._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </Link>

                      <button
                        onClick={() => eliminarPerfil(p._id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
