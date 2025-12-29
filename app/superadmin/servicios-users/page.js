"use client";

import { useEffect, useState } from "react";
import {
  crearServicioUser,
  listarServicioUsers,
} from "../api/serviciosUsersApi";

const AREAS = [
  "RAYOS",
  "LABORATORIO",
  "ESPIROMETRIA",
  "CARDIOLOGIA",
  "AUDIOMETRIA",
  "PSICOLOGIA",
];

export default function ServiciosUsersPage() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargar = async () => {
    const data = await listarServicioUsers();
    setUsers(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const toggleArea = (area) => {
    setAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (areas.length === 0) {
      setError("Seleccioná al menos un área");
      return;
    }

    setLoading(true);
    try {
      await crearServicioUser(username, password, areas);
      setUsername("");
      setPassword("");
      setAreas([]);
      await cargar();
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Usuarios de Servicios
      </h1>

      {/* FORMULARIO */}
      <form
        onSubmit={submit}
        className="bg-white p-4 rounded shadow max-w-md space-y-4"
      >
        <h2 className="font-semibold">Crear usuario</h2>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <input
          type="text"
          placeholder="Usuario"
          className="border p-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ÁREAS */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Áreas habilitadas
          </p>

          <div className="grid grid-cols-2 gap-2">
            {AREAS.map((area) => (
              <label
                key={area}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={areas.includes(area)}
                  onChange={() => toggleArea(area)}
                />
                {area}
              </label>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          {loading ? "Creando..." : "Crear usuario"}
        </button>
      </form>

      {/* LISTADO */}
      <div className="bg-white rounded shadow p-4 max-w-md">
        <h2 className="font-semibold mb-3">
          Usuarios existentes
        </h2>

        {users.length === 0 && (
          <p className="text-sm text-gray-500">
            No hay usuarios creados
          </p>
        )}

        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              className="border rounded p-3 space-y-1"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {u.username}
                </span>
                <span className="text-xs text-gray-500">
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {u.areas?.map((a) => (
                  <span
                    key={a}
                    className="text-xs bg-gray-200 px-2 py-0.5 rounded"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
