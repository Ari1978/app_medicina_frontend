
"use client";

// ✅ API dinámico (LOCAL + FLY)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, ""); // 👈 evita doble slash


export default function GeoAdminPage() {
  const sync = async () => {
    const ok = confirm("¿Seguro que querés sincronizar toda la geografía?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/geo/sync`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al sincronizar");
        return;
      }

      alert("Geografía sincronizada correctamente");
    } catch (err) {
      console.error("Error sincronizando geografía:", err);
      alert("Error de conexión al sincronizar");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Geolocalización</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <p className="text-gray-700">
          Esta acción descarga provincias, partidos y localidades desde la base
          oficial del Estado y las guarda en el sistema.
        </p>

        <button
          onClick={sync}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sincronizar Geografía
        </button>
      </div>
    </div>
  );
}
