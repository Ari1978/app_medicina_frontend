
"use client";

import { useEffect, useState } from "react";

export default function TurnosRecepcion() {
  const [turnos, setTurnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // ✅ cargar turnos del día
  useEffect(() => {
    fetch("http://localhost:4000/api/recepcion/turnos-hoy", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTurnos(data));
  }, []);

  // ✅ buscador
  useEffect(() => {
    if (!busqueda) return;

    fetch(
      `http://localhost:4000/api/recepcion/buscar?query=${busqueda}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setTurnos(data));
  }, [busqueda]);

  // ✅ confirmar turno
  const confirmar = async (id) => {
    await fetch(`http://localhost:4000/api/recepcion/turnos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ estado: "confirmado" }),
    });

    setTurnos((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, estado: "confirmado" } : t
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Turnos del día</h2>

      <input
        placeholder="Buscar por nombre, apellido o DNI"
        className="border p-2 rounded w-full mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>DNI</th>
              <th>Estudios</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Confirmar</th>
              <th>Imprimir</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map((t) => (
              <tr key={t._id} className="text-center border-t">
                <td>{t.hora}</td>
                <td>{t.empleadoApellido} {t.empleadoNombre}</td>
                <td>{t.empleadoDni}</td>
                <td>{t.listaEstudios?.join(", ")}</td>
                <td>{t.empresa?.razonSocial}</td>
                <td className="capitalize">{t.estado}</td>

                <td>
                  {t.estado !== "confirmado" && (
                    <button
                      onClick={() => confirmar(t._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Confirmar
                    </button>
                  )}
                </td>

                <td>
                  {t.estado === "confirmado" && (
                    <a
                      href={`http://localhost:4000/api/recepcion/turnos/${t._id}/imprimir`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Imprimir
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
