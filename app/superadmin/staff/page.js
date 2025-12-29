"use client";

import { useEffect, useState } from "react";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");


export default function StaffAdminPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showPermisos, setShowPermisos] = useState(false);

  const [selected, setSelected] = useState(null);

  const [formCreate, setFormCreate] = useState({
    username: "",
    password: "",
  });

  const [formEdit, setFormEdit] = useState({
    username: "",
  });

  const [formReset, setFormReset] = useState({
    password: "",
  });

  const [permisos, setPermisos] = useState("");

  // ============================
  // CARGAR STAFF (LOCAL + PROD)
  // ============================

  const cargarStaff = async () => {
    setLoading(true);

    const res = await fetch(`${API_URL}/api/superadmin/staff`, {
      credentials: "include",
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setStaff(data);
    } else if (Array.isArray(data.staff)) {
      setStaff(data.staff);
    } else {
      setStaff([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarStaff();
  }, []);

  // ============================
  // CRUD ACTIONS (LOCAL + PROD)
  // ============================

  const crearStaff = async () => {
    if (!formCreate.username || !formCreate.password) {
      alert("Completá todos los campos");
      return;
    }

    const res = await fetch(`${API_URL}/api/superadmin/staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formCreate),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al crear staff");
      return;
    }

    setShowCreate(false);
    setFormCreate({ username: "", password: "" });
    cargarStaff();
  };

  const editarStaff = async () => {
    if (!selected?._id) return;

    const res = await fetch(
      `${API_URL}/api/superadmin/staff/${selected._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formEdit),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al editar");
      return;
    }

    setShowEdit(false);
    setSelected(null);
    cargarStaff();
  };

  const resetPassword = async () => {
    if (!selected?._id) return;
    if (!formReset.password) {
      alert("Ingresá una contraseña");
      return;
    }

    const res = await fetch(
      `${API_URL}/api/superadmin/staff/${selected._id}/reset-password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formReset),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al resetear password");
      return;
    }

    setShowReset(false);
    setFormReset({ password: "" });
    setSelected(null);
    alert("Contraseña reseteada");
  };

  const guardarPermisos = async () => {
    if (!selected?._id) return;

    const permisosArray = permisos
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const res = await fetch(
      `${API_URL}/api/superadmin/staff/permisos/${selected._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ permisos: permisosArray }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al guardar permisos");
      return;
    }

    setShowPermisos(false);
    setSelected(null);
    setPermisos("");
    cargarStaff();
  };

  const eliminarStaff = async (id) => {
    if (!id) return;

    const ok = confirm("¿Seguro que querés eliminar este staff?");
    if (!ok) return;

    const res = await fetch(
      `${API_URL}/api/superadmin/staff/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al eliminar");
      return;
    }

    cargarStaff();
  };

  // ============================
  // RENDER
  // ============================

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Crear Staff
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Usuario</th>
              <th className="text-left p-3">Permisos</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              staff.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.username}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {(s.permisos || []).join(", ")}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setSelected(s);
                        setFormEdit({ username: s.username });
                        setShowEdit(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        setSelected(s);
                        setShowReset(true);
                      }}
                      className="text-yellow-600 hover:underline"
                    >
                      Reset Pass
                    </button>

                    <button
                      onClick={() => {
                        setSelected(s);
                        setPermisos((s.permisos || []).join(", "));
                        setShowPermisos(true);
                      }}
                      className="text-purple-600 hover:underline"
                    >
                      Permisos
                    </button>

                    <button
                      onClick={() => eliminarStaff(s._id)}
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
      {/* MODALES */}
      {/* ===================== */}

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Crear Staff">
          <input
            placeholder="Username"
            className="border p-2 rounded w-full"
            value={formCreate.username}
            onChange={(e) =>
              setFormCreate({ ...formCreate, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full"
            value={formCreate.password}
            onChange={(e) =>
              setFormCreate({ ...formCreate, password: e.target.value })
            }
          />

          <button
            onClick={crearStaff}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Crear
          </button>
        </Modal>
      )}

      {showEdit && selected && (
        <Modal onClose={() => setShowEdit(false)} title="Editar Staff">
          <input
            placeholder="Username"
            className="border p-2 rounded w-full"
            value={formEdit.username}
            onChange={(e) =>
              setFormEdit({ ...formEdit, username: e.target.value })
            }
          />

          <button
            onClick={editarStaff}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Guardar cambios
          </button>
        </Modal>
      )}

      {showReset && selected && (
        <Modal onClose={() => setShowReset(false)} title="Resetear Password">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="border p-2 rounded w-full"
            value={formReset.password}
            onChange={(e) =>
              setFormReset({ password: e.target.value })
            }
          />

          <button
            onClick={resetPassword}
            className="bg-yellow-600 text-white w-full py-2 rounded"
          >
            Resetear
          </button>
        </Modal>
      )}

      {showPermisos && selected && (
        <Modal onClose={() => setShowPermisos(false)} title="Permisos">
          <input
            placeholder="permiso1, permiso2, permiso3"
            className="border p-2 rounded w-full"
            value={permisos}
            onChange={(e) => setPermisos(e.target.value)}
          />

          <button
            onClick={guardarPermisos}
            className="bg-purple-600 text-white w-full py-2 rounded"
          >
            Guardar permisos
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
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
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
