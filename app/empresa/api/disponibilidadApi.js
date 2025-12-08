const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDisponibilidad(token, fecha) {
  const url = `${API_URL}/empresa/disponibilidad?fecha=${encodeURIComponent(
    fecha
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined, // ✅ JWT opcional
    },
    credentials: "include", // ✅ cookies en local y producción
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error al obtener disponibilidad: " + error);
  }

  return res.json(); // [{hora, capacidad, ocupados, libres, disponible}]
}
