export default function ServicioCard({ servicio }) {
  if (!servicio) return null;

  return (
    <div className="border rounded-xl p-4 bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">
        {servicio.username}
      </h2>

      <UploadArchivo servicioId={servicio._id} />
    </div>
  );
}
