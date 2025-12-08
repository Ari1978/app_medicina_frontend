// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function enviarVisita(token, data) {
  // ✅ NUNCA más agregamos empresaId
  const res = await fetch(
    `${API_URL}/api/empresa/formularios/visita`,
    {
      method: "POST",
      credentials: "include", // ✅ cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // ✅ SOLO LOS CAMPOS DEL DTO
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("🔥 ERROR BACK:", error);
    throw new Error(error);
  }

  return res.json();
}

