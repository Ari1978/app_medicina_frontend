"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  adjuntoId: string;   // el PDF clínico a cerrar
  token: string;
  onSuccess?: () => void;
}

export default function CerrarInformePanel({
  adjuntoId,
  token,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cerrar() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API}/api/informes/${adjuntoId}/cerrar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Error al cerrar informe");
      }

      setConfirm(false);
      onSuccess?.();
      alert("Informe cerrado correctamente");
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded p-4 bg-white space-y-3">
      <h3 className="font-medium">Cierre de informe</h3>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cerrar informe final
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Esta acción es <strong>irreversible</strong>.
          </p>

          <div className="flex gap-2">
            <button
              onClick={cerrar}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              {loading ? "Cerrando..." : "Confirmar cierre"}
            </button>

            <button
              onClick={() => setConfirm(false)}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
