// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// 🔐 auth por cookie (NO token manual)
export async function crearTurno(data) {
  if (!data?.tipo) {
    throw new Error("Payload inválido: falta tipo");
  }

  // =========================
  // NORMALIZAR ESTUDIOS
  // =========================
  const listaEstudiosNormalizada = (data.listaEstudios ?? []).map((e) => {
    // si viene como string
    if (typeof e === "string") {
      return { codigo: e, estado: "pendiente" };
    }

    // si viene como objeto correcto
    return {
      codigo: e.codigo,
      estado: e.estado ?? "pendiente",
    };
  });

  // =========================
  // PAYLOAD LIMPIO FINAL
  // =========================
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

    motivo: data.motivo,

    // 🔑 SIEMPRE NORMALIZADO
    listaPracticas: listaEstudiosNormalizada,
  };

  // =========================
  // EXAMEN
  // =========================
  if (data.tipo === "examen") {
    payload.perfilExamen = data.perfilExamen || null;
  }

  const res = await fetch(`${API_URL}/api/empresa/turnos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error al crear turno: " + error);
  }

  return res.json();
}
