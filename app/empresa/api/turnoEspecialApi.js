const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function enviarTurnoEspecial(token, data) {
  const res = await fetch(
    `${API_URL}/empresa/formularios/turno-especial`,
    {
      method: "POST",
      credentials: "include", // ✅ cookies en local y producción
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined, // ✅ JWT opcional
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Error al enviar solicitud");
  }

  return res.json();
}
