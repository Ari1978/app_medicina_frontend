

export async function enviarAutorizacion(token, data) {
  const res = await fetch("http://localhost:4000/api/empresa/formularios/autorizacion", {
    method: "POST",
    credentials: "include",
   headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // 🔥 IMPORTANTE para que ASMEL reciba la cookie
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al enviar solicitud");
  return res.json();
}
