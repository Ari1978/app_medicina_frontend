"use client";

export default function EmpresaSummary({ empresa }) {
  const cerrarSesion = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/empresa/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      window.location.href = "/empresa-login";
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-xl p-3 md:p-8">
      
      {/* HEADER: TÍTULO + BOTÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-lg md:text-3xl font-bold text-blue-700">
          Bienvenido, {empresa?.razonSocial || "Empresa"}
        </h1>

        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm w-full sm:w-auto"
        >
          Cerrar sesión
        </button>
      </div>

      {/* GRID DE DATOS */}
      <div className="mt-2 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 text-gray-700">
        
        {/* CUIT */}
        <div className="p-2 md:p-4 bg-white/60 rounded-lg shadow">
          <h4 className="font-semibold text-xs md:text-sm text-gray-600">
            CUIT
          </h4>
          <p className="text-sm md:text-lg">
            {empresa?.cuit || "—"}
          </p>
        </div>

        {/* EMAIL */}
        <div className="p-2 md:p-4 bg-white/60 rounded-lg shadow">
          <h4 className="font-semibold text-xs md:text-sm text-gray-600">
            Email
          </h4>
          <p className="text-sm md:text-lg">
            {empresa?.email1 || "—"}
          </p>
        </div>

        {/* ESTADO */}
        <div className="p-2 md:p-4 bg-white/60 rounded-lg shadow">
          <h4 className="font-semibold text-xs md:text-sm text-gray-600">
            Estado
          </h4>
          <p className="text-sm md:text-lg text-green-700 font-bold">
            Activa
          </p>
        </div>

      </div>
    </div>
  );
}
