// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function enviarTurnoEspecial(token, formData) {
  const res = await fetch(
    `${API_URL}/api/empresa/formularios/turno-especial`,
    {
      method: "POST",
      credentials: "include", // ✅ cookies
      body: formData,         // ✅ SE ENVÍA FORMDATA
      headers: {
        // ❌ NO Content-Type
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );

  if (!res.ok) {
    const e = await res.json();
    console.error("ERROR BACK:", e);
    throw new Error(e.message || "Error al enviar turno especial");
  }

  return res.json();
}
