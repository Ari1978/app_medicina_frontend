// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function enviarAsesoramiento(token, formData) {
  const res = await fetch(
    `${API_URL}/api/empresa/formularios/asesoramiento`,
    {
      method: "POST",
      credentials: "include", // ✅ cookie de sesión
      body: formData,         // ✅ SE ENVÍA FORMDATA DIRECTO
      headers: {
        // ❌ NO pongas Content-Type acá
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );

  if (!res.ok) {
    const e = await res.json();
    console.error("ERROR BACK:", e);
    throw new Error(e.message || "Error al enviar solicitud");
  }

  return res.json();
}
