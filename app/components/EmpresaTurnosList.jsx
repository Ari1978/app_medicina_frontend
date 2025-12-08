"use client";

/// ✅ SOLO PRODUCCIÓN / FLY (sin fallback a localhost)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL en el entorno");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

function puedeCancelar(turno) {
  const ahora = new Date();

  const fecha = new Date(turno.fecha);
  const [hora, minuto] = turno.hora.split(":");
  fecha.setHours(hora, minuto, 0, 0);

  const diff = fecha - ahora;
  const horasRestantes = diff / (1000 * 60 * 60);

  return horasRestantes >= 24;
}

async function cancelarTurno(id) {
  try {
    const resp = await fetch(`${API_URL}/api/empresa/turnos/${id}/cancelar`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await resp.json();

    if (!resp.ok) {
      alert(data.message || "No se pudo cancelar el turno");
    } else {
      alert("Turno cancelado con éxito");
      location.reload();
    }
  } catch (error) {
    alert("Error de conexión con el servidor");
  }
}

export default function TurnosList({ turnos }) {
  if (!turnos || turnos.length === 0) {
    return (
      <p className="text-gray-600 text-lg bg-white/70 p-4 rounded-lg shadow">
        No tenés turnos cargados.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {turnos.map((t) => (
        <div
          key={t._id}
          className="bg-white shadow border border-gray-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-blue-700">
              {t.tipo === "examen" ? "🩺 Examen" : "🔬 Estudio"}
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                t.estado === "provisional"
                  ? "bg-yellow-100 text-yellow-700"
                  : t.estado === "confirmado"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {t.estado}
            </span>
          </div>

          <p><strong>Fecha:</strong> {t.fecha}</p>
          <p><strong>Hora:</strong> {t.hora}</p>

          <p className="mt-2">
            <strong>Empleado:</strong> {t.empleadoApellido}, {t.empleadoNombre}
          </p>

          <p><strong>DNI:</strong> {t.empleadoDni}</p>
          <p><strong>Puesto:</strong> {t.puesto}</p>

          {t.tipo === "examen" && (
            <p className="mt-2">
              <strong>Perfil examen:</strong> {t.perfilExamen}
            </p>
          )}

          {t.estudios && t.estudios.length > 0 && (
            <div className="mt-2">
              <strong>Estudios:</strong>
              <ul className="list-disc ml-6">
                {t.estudios.map((e, idx) => (
                  <li key={idx}>
                    {e.nombre} ({e.sector}) — {e.estado}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ----------------------------------
              BOTÓN CANCELAR
          ----------------------------------- */}
          <div className="mt-4">
            <button
              onClick={() => cancelarTurno(t._id)}
              disabled={!puedeCancelar(t)}
              className={`px-4 py-2 rounded font-semibold transition ${
                puedeCancelar(t)
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Cancelar turno
            </button>

            {!puedeCancelar(t) && (
              <p className="text-xs text-gray-500 mt-1">
                Solo puede cancelarse con 24 hs de anticipación.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
