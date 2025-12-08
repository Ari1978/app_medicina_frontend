const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";;

export async function enviarAsesoramiento(token, data) {
  const res = await fetch(
    `${API_URL}/empresa/formularios/asesoramiento`,
    {
      method: "POST",
      credentials: "include", // ✅ necesario para la cookie
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
