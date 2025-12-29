"use client";

import { useEffect, useState } from "react";

import Paso1Empleado from "./PasoEmpleado";
import Paso2TipoMotivo from "./PasoTipoMotivo";
import Paso3Fecha from "./PasoFecha";
import Paso4Hora from "./PasoHora";
import Paso5Solicitante from "./PasoSolicitante";
import Paso6Confirmacion from "./PasoConfirmacion";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function TurnoWizard() {
  const [paso, setPaso] = useState(1);

  // =========================
  // FORM PRINCIPAL (MODELO ÚNICO)
  // =========================
  const [form, setForm] = useState({
    empleadoNombre: "",
    empleadoApellido: "",
    empleadoDni: "",
    puesto: "",

    tipo: "",               // examen | estudios
    motivo: "",             // ingreso | periodico | egreso | etc

    perfilExamen: "",       // ObjectId del perfil

    // [{ codigo: string, estado: "pendiente" }]
    listaEstudios: [],

    // [codigo: string]
    estudiosAdicionales: [],

    fecha: "",
    hora: "",

    solicitanteNombre: "",
    solicitanteApellido: "",
    solicitanteCelular: "",
  });

  // =========================
  // PERFILES DE EXAMEN
  // =========================
  const [perfiles, setPerfiles] = useState([]);

  // =========================
  // CATÁLOGO DE ESTUDIOS
  // =========================
  const [catalogoEstudios, setCatalogoEstudios] = useState([]);

  // =========================
  // CARGAR PERFILES (empresa por cookie)
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/perfil-examen`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setPerfiles(Array.isArray(data) ? data : []);
      })
      .catch(() => setPerfiles([]));
  }, []);

  // =========================
  // CARGAR CATÁLOGO DE ESTUDIOS
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/practicas/catalogo`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setCatalogoEstudios(Array.isArray(data) ? data : []);
      })
      .catch(() => setCatalogoEstudios([]));
  }, []);

  // =========================
  // NAVEGACIÓN
  // =========================
  const next = () => setPaso((p) => p + 1);
  const back = () => setPaso((p) => p - 1);

  const titulos = {
    1: "Datos del Empleado",
    2: "Tipo y Motivo",
    3: "Fecha del Turno",
    4: "Horario Disponible",
    5: "Datos del Solicitante",
    6: "Confirmación",
  };

  const totalPasos = 6;
  const progreso = Math.round((paso / totalPasos) * 100);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 text-center">
        {titulos[paso]}
      </h1>

      {/* PROGRESO */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {/* PASOS */}
      {paso === 1 && (
        <Paso1Empleado
          form={form}
          setForm={setForm}
          next={next}
        />
      )}

      {paso === 2 && (
        <Paso2TipoMotivo
          form={form}
          setForm={setForm}
          perfiles={perfiles}
          catalogoEstudios={catalogoEstudios}
          next={next}
          back={back}
        />
      )}

      {paso === 3 && (
        <Paso3Fecha
          form={form}
          setForm={setForm}
          next={next}
          back={back}
        />
      )}

      {paso === 4 && (
        <Paso4Hora
          form={form}
          setForm={setForm}
          next={next}
          back={back}
        />
      )}

      {paso === 5 && (
        <Paso5Solicitante
          form={form}
          setForm={setForm}
          next={next}
          back={back}
        />
      )}

      {paso === 6 && (
        <Paso6Confirmacion
          form={form}
          back={back}
          catalogoEstudios={catalogoEstudios}
        />
      )}
    </div>
  );
}
