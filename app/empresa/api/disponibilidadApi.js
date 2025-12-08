const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getDisponibilidad(fecha) {
  const url = `${API_URL}/empresa/disponibilidad?fecha=${encodeURIComponent(fecha)}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // ✅ SOLO COOKIE, SIN AUTH HEADER
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
