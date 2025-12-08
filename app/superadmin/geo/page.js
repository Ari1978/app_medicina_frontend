
"use client";

export default function GeoAdminPage() {
  const sync = async () => {
    const ok = confirm("¿Seguro que querés sincronizar toda la geografía?");
    if (!ok) return;

    const res = await fetch("http://localhost:4000/api/geo/sync", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al sincronizar");
      return;
    }

    alert("Geografía sincronizada correctamente");
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
