if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// =========================
// CREAR USUARIO
// =========================
export async function crearServicioUser(username, password) {
  const res = await fetch(`${API_URL}/api/servicios/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error");

  return data;
}

// =========================
// LISTAR USUARIOS
// =========================
export async function listarServicioUsers() {
  const res = await fetch(`${API_URL}/api/servicios/users`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error");
  return res.json();
}

export async function actualizarPermisosServicio(id, permisos) {
  const res = await fetch(
    `${API_URL}/api/servicios/users/${id}/permisos`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ permisos }),
    },
  );

  if (!res.ok) throw new Error('Error al actualizar permisos');
  return res.json();
}
