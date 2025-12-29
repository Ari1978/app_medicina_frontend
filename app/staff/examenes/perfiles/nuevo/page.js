"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function NuevoPerfilPage() {
  const router = useRouter();

  const [puesto, setPuesto] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("");

  const [empresas, setEmpresas] = useState([]);
  const [catalogoPracticas, setCatalogoPracticas] = useState([]);
  const [practicasPerfil, setPracticasPerfil] = useState([]); // ['100','400']

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // EMPRESAS
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/empresa`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setEmpresas(Array.isArray(d) ? d : d?.data || []))
      .catch(() => setEmpresas([]));
  }, []);

  // =========================
  // CATÁLOGO DE PRÁCTICAS
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/practicas/catalogo`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setCatalogoPracticas(Array.isArray(d) ? d : []))
      .catch(() => setCatalogoPracticas([]));
  }, []);

  // =========================
  // FILTRADO
  // =========================
  const practicasFiltradas = catalogoPracticas.filter((p) => {
    if (!p?.codigo || !p?.nombre) return false;
    if (!search) return true;

    const q = search.toLowerCase();
    return (
      p.codigo.toLowerCase().includes(q) ||
      p.nombre.toLowerCase().includes(q)
    );
  });

  // =========================
  // MANEJO PRÁCTICAS
  // =========================
  const agregarPractica = (codigo) => {
    if (!codigo) return;
    if (practicasPerfil.includes(codigo)) return;

    setPracticasPerfil((prev) => [...prev, codigo]);
    setSearch("");
  };

  const eliminarPractica = (codigo) => {
    setPracticasPerfil((prev) => prev.filter((c) => c !== codigo));
  };

  // =========================
  // GUARDAR PERFIL
  // =========================
  const guardar = async () => {
  if (!puesto || !empresaId || !tipoPerfil || practicasPerfil.length === 0) {
    alert("Completá todos los campos obligatorios");
    return;
  }

  const payload = {
    puesto: puesto.trim(),
    tipo: tipoPerfil,
    empresaId,
    practicasPerfil, // ✅ CORRECTO
  };

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/perfil-examen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error();

    router.push("/staff/examenes/perfiles");
  } catch (err) {
    console.error(err);
    alert("Error al crear perfil");
  } finally {
    setLoading(false);
  }
};


  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">Nuevo Perfil de Examen</h2>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Puesto"
        value={puesto}
        onChange={(e) => setPuesto(e.target.value)}
      />

      <select
        className="w-full border rounded px-3 py-2"
        value={empresaId}
        onChange={(e) => setEmpresaId(e.target.value)}
      >
        <option value="">Empresa...</option>
        {empresas.map((e) => (
          <option key={e._id} value={e._id}>
            {e.razonSocial}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded px-3 py-2"
        value={tipoPerfil}
        onChange={(e) => setTipoPerfil(e.target.value)}
      >
        <option value="">Tipo perfil...</option>
        <option value="ingreso">Ingreso</option>
        <option value="periodico">Periódico</option>
        <option value="egreso">Egreso</option>
      </select>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Buscar práctica..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="w-full border rounded px-3 py-2"
        onChange={(e) => agregarPractica(e.target.value)}
      >
        <option value="">Agregar práctica...</option>
        {practicasFiltradas.map((p) => (
          <option key={p.codigo} value={p.codigo}>
            [{p.codigo}] {p.nombre} ({p.sector})
          </option>
        ))}
      </select>

      <ul className="space-y-1">
        {practicasPerfil.map((codigo) => {
          const meta = catalogoPracticas.find((p) => p.codigo === codigo);

          return (
            <li
              key={codigo}
              className="flex justify-between bg-gray-100 px-3 py-1 rounded"
            >
              <span>
                [{codigo}] {meta?.nombre} ({meta?.sector})
              </span>
              <button
                onClick={() => eliminarPractica(codigo)}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="border px-4 py-2 rounded">
          Cancelar
        </button>

        <button
          onClick={guardar}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
