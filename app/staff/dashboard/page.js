"use client";

import { useEffect, useState } from "react";

// ✅ SOLO PRODUCCIÓN / FLY
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}
const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function StaffDashboard() {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/staff/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStaff(data));
  }, []);

  if (!staff) return <p className="text-gray-600">Cargando...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Bienvenido, {staff.username}
      </h2>

      <p className="text-gray-600 mt-2">
        Accedé a los módulos desde el menú lateral.
      </p>
    </div>
  );
}
