

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export async function loginServicio(username, password) {
  const res = await fetch(
    `${API_URL}/api/servicios/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Credenciales inválidas");
  }

  return data;
}
