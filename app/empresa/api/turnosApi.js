// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");


export async function crearTurno(token, data) {
  // ✅ Construimos el payload limpio según el tipo
  const payload = {
    tipo: data.tipo,
    empleadoNombre: data.empleadoNombre,
    empleadoApellido: data.empleadoApellido,
    empleadoDni: data.empleadoDni,
    puesto: data.puesto,
    fecha: data.fecha,
    hora: data.hora,
    solicitanteNombre: data.solicitanteNombre,
    solicitanteApellido: data.solicitanteApellido,
    solicitanteCelular: data.solicitanteCelular,
  };

  // ✅ SOLO SI ES EXAMEN
  if (data.tipo === "examen") {
    payload.motivo = data.motivo; // ingreso | egreso | periodico
    payload.perfilExamen = data.perfilExamen;
    payload.estudiosAdicionales = data.estudiosAdicionales ?? [];
    payload.listaEstudios = data.listaEstudios ?? [];
  }

  // ✅ SOLO SI ES ESTUDIO
  if (data.tipo === "estudios") {
    payload.motivoEstudio = data.motivoEstudio; // complementario | pendiente | otro
    payload.listaEstudios = data.listaEstudios; // obligatorio
  }

  const res = await fetch(`${API_URL}/api/empresa/turnos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined, // ✅ JWT opcional
    },
    credentials: "include", // ✅ cookies en local y producción
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error al crear turno: " + error);
  }

  return res.json();
}
