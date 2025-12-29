export default function PracticaCard({
  nombre,
  codigo,
  estado,
  adjuntos = [],
  texto,
  editable,
}: {
  nombre: string;
  codigo: string;
  estado: "pendiente" | "evaluacion" | "completa";
  adjuntos: any[];
  texto?: string;
  editable?: boolean;
}) {
  const badge =
    estado === "completa"
      ? "bg-green-100 text-green-700"
      : estado === "evaluacion"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-medium">
          {nombre}
        </h2>

        <span className={`px-3 py-1 text-sm rounded ${badge}`}>
          {estado}
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Código: {codigo}
      </p>

      {/* Adjuntos */}
      <div className="space-y-1">
        {adjuntos.length > 0 ? (
          adjuntos.map((a: any) => (
            <a
              key={a._id}
              href={`/api/adjuntos/${a._id}/descargar`}
              className="text-blue-600 text-sm underline block"
            >
              📄 {a.nombre || "Ver archivo"}
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            Sin archivos cargados
          </p>
        )}
      </div>

      {/* Pre-informe */}
      {editable && (
        <textarea
          defaultValue={texto}
          placeholder="Escribir pre-informe..."
          className="w-full border rounded p-2 text-sm"
        />
      )}
    </div>
  );
}
