export default function HeaderTurno({
  postulante,
  empresa,
  fecha,
  estado,
}: {
  postulante: string;
  empresa: string;
  fecha: string;
  estado: "pendiente" | "evaluacion" | "finalizado";
}) {
  const estadoColor =
    estado === "finalizado"
      ? "bg-green-100 text-green-700"
      : estado === "evaluacion"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="border-b pb-4 space-y-1">
      <h1 className="text-xl font-semibold">
        {postulante}
      </h1>

      <p className="text-sm text-gray-600">
        {empresa} · {fecha}
      </p>

      <span
        className={`inline-block mt-2 px-3 py-1 rounded text-sm ${estadoColor}`}
      >
        Estado: {estado}
      </span>
    </div>
  );
}
