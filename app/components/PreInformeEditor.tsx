import { usePreInforme } from "../hooks/usePreInforme";

interface Props {
  turnoId: string;
  token: string;
}

export default function PreInformeEditor({ turnoId, token }: Props) {
  const { texto, setTexto, saving } =
    usePreInforme(turnoId, token);

  return (
    <div className="border rounded p-4 space-y-2 bg-white">
      <div className="flex justify-between">
        <h3 className="font-medium">
          Pre-informe general
        </h3>
        <span className="text-sm text-gray-500">
          {saving ? "Guardando..." : "Guardado"}
        </span>
      </div>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Observaciones médicas generales..."
        className="w-full min-h-[120px] border rounded p-2 text-sm"
      />
    </div>
  );
}
