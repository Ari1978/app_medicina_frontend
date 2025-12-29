"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function PerfilesPage() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscarPuesto, setBuscarPuesto] = useState("");
  const [buscarEmpresa, setBuscarEmpresa] = useState("");
  const [buscarCliente, setBuscarCliente] = useState("");

  const cargar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/perfil-examen`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setPerfiles(Array.isArray(data) ? data : []);
    } catch {
      setPerfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminarPerfil = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este perfil?")) return;

    try {
      const res = await fetch(`${API_URL}/api/perfil-examen/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error();
      cargar();
    } catch {
      alert("No se pudo eliminar el perfil");
    }
  };

  const perfilesFiltrados = perfiles.filter((p) => {
    const empresaNombre = p.empresa?.razonSocial || "";
    const clienteNum = p.empresa?.numeroCliente?.toString() || "";

    return (
      p.puesto.toLowerCase().includes(buscarPuesto.toLowerCase()) &&
      empresaNombre.toLowerCase().includes(buscarEmpresa.toLowerCase()) &&
      clienteNum.includes(buscarCliente)
    );
  });

  const perfilesPorEmpresa = perfilesFiltrados.reduce((acc, perfil) => {
    const empresaId = perfil.empresa?._id || "sin-empresa";

    if (!acc[empresaId]) {
      acc[empresaId] = {
        empresa: perfil.empresa,
        perfiles: [],
      };
    }

    acc[empresaId].perfiles.push(perfil);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfiles de Exámenes</h2>

        <Link
          href="/staff/examenes/perfiles/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Perfil
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Buscar puesto"
          value={buscarPuesto}
          onChange={(e) => setBuscarPuesto(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Buscar empresa"
          value={buscarEmpresa}
          onChange={(e) => setBuscarEmpresa(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="N° cliente"
          value={buscarCliente}
          onChange={(e) => setBuscarCliente(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={() => {
            setBuscarPuesto("");
            setBuscarEmpresa("");
            setBuscarCliente("");
          }}
          className="border rounded"
        >
          Limpiar
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading &&
        Object.entries(perfilesPorEmpresa).map(([empresaId, data]) => (
          <div key={`empresa-${empresaId}`} className="space-y-4">
            <h3 className="text-xl font-semibold">
              {data.empresa?.razonSocial || "Sin empresa"} — Cliente Nº{" "}
              {data.empresa?.numeroCliente || "—"}
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.perfiles.map((p) => (
                <div
                  key={`${empresaId}-${p._id}`}
                  className="border rounded p-4"
                >
                  <h4 className="font-semibold">{p.puesto}</h4>

                  <p className="text-sm">
                    {(p.practicas || [])
                      .map((pr) =>
                        pr?.nombre && pr?.sector
                          ? `${pr.nombre} (${pr.sector})`
                          : null
                      )
                      .filter(Boolean)
                      .join(", ") || "Sin prácticas asignadas"}
                  </p>

                  <div className="flex justify-between mt-3 text-sm">
                    <Link
                      href={`/staff/examenes/perfiles/${p._id}`}
                      className="text-blue-600"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => eliminarPerfil(p._id)}
                      className="text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
