
"use client";

import { useEffect, useState } from "react";

// ✅ API dinámico (LOCAL + FLY)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, ""); // 👈 evita doble slash


export default function SuperAdminPerfilesPage() {
  const [perfiles, setPerfiles] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selected, setSelected] = useState(null);

  const [formCreate, setFormCreate] = useState({
    puesto: "",
    empresaId: "",
    estudios: [],
  });

  const [formEdit, setFormEdit] = useState({
    puesto: "",
    estudios: [],
  });

  const [nuevoEstudio, setNuevoEstudio] = useState({
    nombre: "",
    sector: "",
  });

  // ============================
  // CARGAR DATOS
  // ============================

  const cargarPerfiles = async () => {
    const res = await fetch(`${API_URL}/perfil-examen`, {
      credentials: "include",
    });

    const data = await res.json();
    setPerfiles(Array.isArray(data) ? data : []);
  };

  const cargarEmpresas = async () => {
    const res = await fetch(
      `${API_URL}/superadmin/empresas-finales`,
      { credentials: "include" }
    );

    const data = await res.json();
    setEmpresas(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await cargarPerfiles();
      await cargarEmpresas();
      setLoading(false);
    })();
  }, []);

  // ============================
  // CRUD
  // ============================

  const agregarEstudio = () => {
    if (!nuevoEstudio.nombre || !nuevoEstudio.sector) return;

    setFormCreate({
      ...formCreate,
      estudios: [...formCreate.estudios, nuevoEstudio],
    });

    setNuevoEstudio({ nombre: "", sector: "" });
  };

  const crearPerfil = async () => {
    if (!formCreate.puesto || !formCreate.empresaId) {
      alert("Completá puesto y empresa");
      return;
    }

    const res = await fetch(`${API_URL}/perfil-examen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formCreate),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al crear perfil");
      return;
    }

    setShowCreate(false);
    setFormCreate({ puesto: "", empresaId: "", estudios: [] });
    await cargarPerfiles();
  };

  const eliminarPerfil = async (id) => {
    const ok = confirm("¿Eliminar este perfil?");
    if (!ok) return;

    await fetch(`${API_URL}/perfil-examen/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await cargarPerfiles();
  };

  // ============================
  // RENDER
  // ============================

  if (loading) return <p>Cargando perfiles...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Perfiles de Examen</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Crear Perfil
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Puesto</th>
              <th className="p-3 text-left">Empresa</th>
              <th className="p-3 text-left">Estudios</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {perfiles.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.puesto}</td>
                <td className="p-3">
                  {p.empresa?.razonSocial || "—"}
                </td>
                <td className="p-3 text-sm">
                  {Array.isArray(p.estudios) &&
                    p.estudios.map((e, i) => (
                      <span
                        key={i}
                        className="inline-block bg-gray-200 px-2 py-1 rounded mr-1 mb-1"
                      >
                        {e.nombre} ({e.sector})
                      </span>
                    ))}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => eliminarPerfil(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== */}
      {/* MODAL CREAR PERFIL */}
      {/* ===================== */}

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Crear Perfil">
          <input
            placeholder="Puesto"
            className="border p-2 rounded w-full"
            value={formCreate.puesto}
            onChange={(e) =>
              setFormCreate({ ...formCreate, puesto: e.target.value })
            }
          />

          <select
            className="border p-2 rounded w-full"
            value={formCreate.empresaId}
            onChange={(e) =>
              setFormCreate({
                ...formCreate,
                empresaId: e.target.value,
              })
            }
          >
            <option value="">Seleccionar empresa</option>
            {empresas.map((e) => (
              <option key={e._id} value={e._id}>
                {e.razonSocial}
              </option>
            ))}
          </select>

          <div className="border rounded p-3 space-y-2">
            <div className="flex gap-2">
              <input
                placeholder="Estudio"
                className="border p-2 rounded w-full"
                value={nuevoEstudio.nombre}
                onChange={(e) =>
                  setNuevoEstudio({
                    ...nuevoEstudio,
                    nombre: e.target.value,
                  })
                }
              />

              <input
                placeholder="Sector"
                className="border p-2 rounded w-full"
                value={nuevoEstudio.sector}
                onChange={(e) =>
                  setNuevoEstudio({
                    ...nuevoEstudio,
                    sector: e.target.value,
                  })
                }
              />
            </div>

            <button
              onClick={agregarEstudio}
              className="text-sm text-blue-600 underline"
            >
              + Agregar estudio
            </button>

            <div className="text-sm text-gray-600">
              {formCreate.estudios.map((e, i) => (
                <div key={i}>
                  • {e.nombre} ({e.sector})
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={crearPerfil}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Crear Perfil
          </button>
        </Modal>
      )}
    </div>
  );
}

// ============================
// MODAL REUTILIZABLE
// ============================

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-600">
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
