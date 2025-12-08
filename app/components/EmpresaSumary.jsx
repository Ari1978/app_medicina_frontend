"use client";

export default function EmpresaSummary({ empresa }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-xl p-3 md:p-8">
      
      {/* TÍTULO */}
      <h1 className="text-lg md:text-3xl font-bold text-blue-700">
        Bienvenido, {empresa?.razonSocial || "Empresa"}
      </h1>

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
            {empresa?.email || "—"}
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
