"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SuperAdminSedesPage() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [provincias, setProvincias] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selected, setSelected] = useState(null);

  const initialForm = {
    nombre: "",
    provincia: "",
    partido: "",
    localidad: "",
    direccion: "",
    telefono1: "",
    telefono2: "",
    horarios: "",
  };

  const [formCreate, setFormCreate] = useState(initialForm);
  const [formEdit, setFormEdit] = useState(initialForm);

  // ============================
  // CARGAR GEO
  // ============================

  const cargarProvincias = async () => {
    const res = await fetch(`${API_URL}/geo/provincias`);
    const data = await res.json();
    setProvincias(Array.isArray(data) ? data : []);
  };

  const cargarPartidos = async (provincia) => {
    if (!provincia) return;

    const res = await fetch(
      `${API_URL}/geo/partidos?provincia=${provincia}`
    );
    const data = await res.json();
    setPartidos(Array.isArray(data) ? data : []);
  };

  const cargarLocalidades = async (provincia, partido) => {
    if (!provincia || !partido) return;

    const res = await fetch(
      `${API_URL}/geo/localidades?provincia=${provincia}&partido=${partido}`
    );
    const data = await res.json();
    setLocalidades(Array.isArray(data) ? data : []);
  };

  // ============================
  // CARGAR SEDES
  // ============================

  const cargarSedes = async () => {
    setLoading(true);

    const res = await fetch(`${API_URL}/superadmin/sedes`, {
      credentials: "include",
    });

    const data = await res.json();
    setSedes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    cargarSedes();
    cargarProvincias();
  }, []);

  // ============================
  // CREAR
  // ============================

  const crearSede = async () => {
    if (
      !formCreate.nombre ||
      !formCreate.provincia ||
      !formCreate.partido ||
      !formCreate.localidad ||
      !formCreate.direccion ||
      !formCreate.telefono1 ||
      !formCreate.horarios
    ) {
      alert("Completá todos los campos obligatorios");
      return;
    }

    const res = await fetch(`${API_URL}/superadmin/sedes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formCreate),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al crear sede");
      return;
    }

    setShowCreate(false);
    setFormCreate(initialForm);
    cargarSedes();
  };

  // ============================
  // EDITAR
  // ============================

  const editarSede = async () => {
    if (!selected?._id) return;

    const res = await fetch(
      `${API_URL}/superadmin/sedes/${selected._id}`,
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
    cargarSedes();
  };

  // ============================
  // ELIMINAR
  // ============================

  const eliminarSede = async (id) => {
    const ok = confirm("¿Seguro que querés eliminar esta sede?");
    if (!ok) return;

    const res = await fetch(
      `${API_URL}/superadmin/sedes/${id}`,
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

    cargarSedes();
  };

  // ============================
  // RENDER
  // ============================

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sedes</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Crear Sede
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Dirección</th>
              <th className="p-2 text-left">Teléfonos</th>
              <th className="p-2 text-left">Días y horarios</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              sedes.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2 font-medium">{s.nombre}</td>
                  <td className="p-2">
                    {s.direccion} – {s.localidad}, {s.partido}, {s.provincia}
                  </td>
                  <td className="p-2">
                    {s.telefono1}
                    {s.telefono2 && ` / ${s.telefono2}`}
                  </td>
                  <td className="p-2">{s.horarios}</td>
                  <td className="p-2 space-x-3">
                    <button
                      onClick={() => {
                        setSelected(s);
                        setFormEdit({ ...s });
                        setShowEdit(true);

                        cargarPartidos(s.provincia);
                        cargarLocalidades(s.provincia, s.partido);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarSede(s._id)}
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

      {(showCreate || showEdit) && (
        <Modal
          onClose={() => {
            setShowCreate(false);
            setShowEdit(false);
          }}
          title={showCreate ? "Crear Sede" : "Editar Sede"}
        >
          {[
            ["nombre", "Nombre"],
            ["direccion", "Dirección"],
            ["telefono1", "Teléfono 1"],
            ["telefono2", "Teléfono 2"],
            ["horarios", "Horarios"],
          ].map(([key, label]) => (
            <input
              key={key}
              placeholder={label}
              className="border p-2 rounded w-full"
              value={(showCreate ? formCreate : formEdit)[key] || ""}
              onChange={(e) =>
                showCreate
                  ? setFormCreate({ ...formCreate, [key]: e.target.value })
                  : setFormEdit({ ...formEdit, [key]: e.target.value })
              }
            />
          ))}

          {/* PROVINCIA */}
          <select
            className="border p-2 rounded w-full"
            value={(showCreate ? formCreate : formEdit).provincia}
            onChange={(e) => {
              const val = e.target.value;
              if (showCreate) {
                setFormCreate({
                  ...formCreate,
                  provincia: val,
                  partido: "",
                  localidad: "",
                });
              } else {
                setFormEdit({
                  ...formEdit,
                  provincia: val,
                  partido: "",
                  localidad: "",
                });
              }

              cargarPartidos(val);
              setLocalidades([]);
            }}
          >
            <option value="">Provincia</option>
            {provincias.map((p) => (
              <option key={p._id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* PARTIDO */}
          <select
            className="border p-2 rounded w-full"
            value={(showCreate ? formCreate : formEdit).partido}
            onChange={(e) => {
              const val = e.target.value;
              const provincia =
                (showCreate ? formCreate : formEdit).provincia;

              showCreate
                ? setFormCreate({
                    ...formCreate,
                    partido: val,
                    localidad: "",
                  })
                : setFormEdit({
                    ...formEdit,
                    partido: val,
                    localidad: "",
                  });

              cargarLocalidades(provincia, val);
            }}
            disabled={!((showCreate ? formCreate : formEdit).provincia)}
          >
            <option value="">Partido</option>
            {partidos.map((p) => (
              <option key={p._id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* LOCALIDAD */}
          <select
            className="border p-2 rounded w-full"
            value={(showCreate ? formCreate : formEdit).localidad}
            onChange={(e) =>
              showCreate
                ? setFormCreate({
                    ...formCreate,
                    localidad: e.target.value,
                  })
                : setFormEdit({
                    ...formEdit,
                    localidad: e.target.value,
                  })
            }
            disabled={!((showCreate ? formCreate : formEdit).partido)}
          >
            <option value="">Localidad</option>
            {localidades.map((l) => (
              <option key={l._id} value={l.nombre}>
                {l.nombre}
              </option>
            ))}
          </select>

          <button
            onClick={showCreate ? crearSede : editarSede}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            {showCreate ? "Crear" : "Guardar cambios"}
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
