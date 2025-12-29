export default function EstadoPracticasBar({
  total,
  pendientes,
  evaluacion,
  completas,
}: {
  total: number;
  pendientes: number;
  evaluacion: number;
  completas: number;
}) {
  return (
    <div className="flex gap-4 text-sm">
      <span>Prácticas: {total}</span>
      <span className="text-red-600">🔴 {pendientes}</span>
      <span className="text-yellow-600">🟡 {evaluacion}</span>
      <span className="text-green-600">🟢 {completas}</span>
    </div>
  );
}
