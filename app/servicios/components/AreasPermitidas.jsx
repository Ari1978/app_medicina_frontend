"use client";

import { useAuth } from "@/app/context/AuthContext";

export default function AreasPermitidas() {
  const { user } = useAuth();

  if (!user?.areas?.length) {
    return <p>No hay áreas asignadas</p>;
  }

  return (
    <div className="bg-white rounded p-4 shadow">
      <h2 className="font-semibold mb-2">
        Áreas habilitadas
      </h2>

      <div className="flex flex-wrap gap-2">
        {user.areas.map((a) => (
          <span
            key={a}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
