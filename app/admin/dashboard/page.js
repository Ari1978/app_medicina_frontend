
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Administrador
      </h1>

      <p className="text-gray-600">
        Panel de control general del sistema ASMEL.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border">
          <h3 className="font-semibold text-lg">Empresas</h3>
          <p className="text-sm text-gray-500 mt-2">
            Gestión de empresas registradas
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <h3 className="font-semibold text-lg">Formularios</h3>
          <p className="text-sm text-gray-500 mt-2">
            Visitas, asesoramiento y autorizaciones
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <h3 className="font-semibold text-lg">Presupuestos</h3>
          <p className="text-sm text-gray-500 mt-2">
            Solicitudes de presupuesto
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <h3 className="font-semibold text-lg">Reportes</h3>
          <p className="text-sm text-gray-500 mt-2">
            Estadísticas y exportaciones
          </p>
        </div>
      </div>
    </div>
  );
}
