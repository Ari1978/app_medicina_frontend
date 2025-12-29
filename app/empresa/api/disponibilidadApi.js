// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function getDisponibilidad(fecha) {
  const url = `${API_URL}/api/empresa/disponibilidad?fecha=${encodeURIComponent(
    fecha
  )}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // ✅ cookie auth
    cache: "no-store",      // 🔥 ESTO ES LO QUE FALTABA
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error al obtener disponibilidad: " + error);
  }

  return res.json();
}
