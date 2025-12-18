"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function ResultadosStaff() {
  const router = useRouter();

  // filtros
  const [empresa, setEmpresa] = useState("");
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");

  // data
  const [resultadosBase, setResultadosBase] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CARGA INICIAL (REALIZADOS)
  // =========================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/staff/turnos/realizados`,
          { credentials: "include" }
        );

        const data = await res.json();
        setResultadosBase(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando resultados", err);
        setResultadosBase([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // =========================
  // FILTROS REALES
  // =========================
  const resultados = useMemo(() => {
    return resultadosBase.filter(r => {
      const matchEmpresa =
        !empresa ||
        r.empresa?.razonSocial
          ?.toLowerCase()
          .includes(empresa.toLowerCase());

      const matchNombre =
        !nombre ||
        `${r.empleadoApellido} ${r.empleadoNombre}`
          .toLowerCase()
          .includes(nombre.toLowerCase());

      const matchDni =
        !dni || r.empleadoDni?.includes(dni);

      return matchEmpresa && matchNombre && matchDni;
    });
  }, [empresa, nombre, dni, resultadosBase]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Ver o editar Resultados
      </h1>

      {/* =========================
          FILTROS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="Empresa"
          value={empresa}
          onChange={e => setEmpresa(e.target.value)}
        />

        <input
          className="border rounded-lg px-4 py-2"
          placeholder="Nombre o apellido"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        <input
          className="border rounded-lg px-4 py-2"
          placeholder="DNI"
          value={dni}
          onChange={e => setDni(e.target.value)}
        />
      </div>

      {/* =========================
          TABLA
      ========================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Apellido</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-center">DNI</th>
              <th className="px-4 py-3 text-center">Puesto</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {!loading && resultados.map(r => (
              <tr
                key={r._id}
                className="hover:bg-blue-50 transition"
              >
                <td className="px-4 py-2 font-semibold">
                  {r.empleadoApellido}
                </td>

                <td className="px-4 py-2">
                  {r.empleadoNombre}
                </td>

                <td className="px-4 py-2 text-center">
                  {r.empleadoDni}
                </td>

                <td className="px-4 py-2 text-center">
                  {r.puesto || "—"}
                </td>

                <td className="px-4 py-2">
                  {r.empresa?.razonSocial || "—"}
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() =>
                      router.push(
                        `/staff/examenes/resultados/editar/${r._id}`
                      )
                    }
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Ver / Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && resultados.length === 0 && (
          <p className="text-center text-gray-500 p-6">
            No se encontraron resultados.
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 p-6">
            Cargando resultados…
          </p>
        )}
      </div>
    </div>
  );
}
