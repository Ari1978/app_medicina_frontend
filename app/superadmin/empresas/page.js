"use client";

import { useEffect, useState } from "react";

// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");


export default function EmpresasAdminPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReset, setShowReset] = useState(false);
  const [selected, setSelected] = useState(null);

  const [formReset, setFormReset] = useState({
    password: "",
  });

  // ============================
  // CARGAR EMPRESAS (LOCAL + PROD)
  // ============================

  const cargarEmpresas = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/superadmin/empresas-finales`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setEmpresas(data);
      } else if (Array.isArray(data.empresas)) {
        setEmpresas(data.empresas);
      } else {
        setEmpresas([]);
      }
    } catch {
      setEmpresas([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  // ============================
  // ACCIONES (LOCAL + PROD)
  // ============================

  const toggleEmpresa = async (empresa) => {
    if (!empresa?._id) return;

    const res = await fetch(
      `${API_URL}/api/superadmin/empresas-finales/${empresa._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ activo: !empresa.activo }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al actualizar estado");
      return;
    }

    cargarEmpresas();
  };

  const resetPassword = async () => {
    if (!selected?._id) return;
    if (!formReset.password) {
      alert("Ingresá una contraseña");
      return;
    }

    const res = await fetch(
      `${API_URL}/api/superadmin/empresas-finales/${selected._id}/reset-password`,
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
    setSelected(null);
    setFormReset({ password: "" });
    alert("Contraseña reseteada");
  };

  const eliminarEmpresa = async (id) => {
    if (!id) return;

    const ok = confirm("¿Seguro que querés eliminar esta empresa?");
    if (!ok) return;

    const res = await fetch(
      `${API_URL}/api/superadmin/empresas-finales/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al eliminar empresa");
      return;
    }

    cargarEmpresas();
  };

  // ============================
  // RENDER
  // ============================

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Empresas</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Razón Social</th>
              <th className="text-left p-3">CUIT</th>
              <th className="text-left p-3">ART</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Cargando empresas...
                </td>
              </tr>
            )}

            {!loading &&
              empresas.map((e) => (
                <tr key={e._id || e.cuit} className="border-t">
                  <td className="p-3">{e.razonSocial}</td>
                  <td className="p-3">{e.cuit}</td>
                  <td className="p-3">{e.art}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        e.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {e.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => toggleEmpresa(e)}
                      className="text-blue-600 hover:underline"
                    >
                      {e.activo ? "Desactivar" : "Activar"}
                    </button>

                    <button
                      onClick={() => {
                        setSelected(e);
                        setShowReset(true);
                      }}
                      className="text-yellow-600 hover:underline"
                    >
                      Reset Pass
                    </button>

                    <button
                      onClick={() => eliminarEmpresa(e._id)}
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
      {/* MODAL RESET PASSWORD */}
      {/* ===================== */}

      {showReset && selected && (
        <Modal
          onClose={() => setShowReset(false)}
          title="Resetear Password Empresa"
        >
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
    </div>
  );
}

// ============================
// MODAL
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
