// ✅ API dinámico (LOCAL + FLY)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, ""); // 👈 evita doble slash


export async function enviarAutorizacion(token, data) {
  const res = await fetch(
    `${API_URL}/empresa/formularios/autorizacion`,
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
