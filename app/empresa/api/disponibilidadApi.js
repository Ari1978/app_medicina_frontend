export async function getDisponibilidad(token, fecha) {
  const url = `http://localhost:4000/api/empresa/disponibilidad?fecha=${encodeURIComponent(fecha)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error al obtener disponibilidad: " + error);
  }

  return res.json(); // [{hora, capacidad, ocupados, libres, disponible}]
}
