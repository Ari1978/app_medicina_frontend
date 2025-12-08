
"use client";

import { createContext, useContext, useState } from "react";

const TurnoContext = createContext(null);

export function TurnoProvider({ children }) {
  const [turno, setTurno] = useState({
    tipo: "",

    // EMPLEADO
    empleadoNombre: "",
    empleadoApellido: "",
    empleadoDni: "",
    puesto: "",

    // DETALLES
    motivo: "",
    perfilExamen: "",
    estudiosAdicionales: [],
    listaEstudios: [],

    // FECHA / HORA
    fecha: "",
    hora: "",

    // SOLICITANTE
    solicitanteNombre: "",
    solicitanteCelular: "",
  });

  const updateTurno = (data) => {
    setTurno((prev) => ({ ...prev, ...data }));
  };

  const resetTurno = () => {
    setTurno({
      tipo: "",
      empleadoNombre: "",
      empleadoApellido: "",
      empleadoDni: "",
      puesto: "",
      motivo: "",
      perfilExamen: "",
      estudiosAdicionales: [],
      listaEstudios: [],
      fecha: "",
      hora: "",
      solicitanteNombre: "",
      solicitanteCelular: "",
    });
  };

  return (
    <TurnoContext.Provider value={{ turno, updateTurno, resetTurno }}>
      {children}
    </TurnoContext.Provider>
  );
}

export const useTurno = () => useContext(TurnoContext);
