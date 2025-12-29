import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export function usePreInforme(turnoId: string, token: string) {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // cargar pre-informe
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${API}/pre-informes/turno/${turnoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTexto(data.observacionGeneral || "");
      }

      setLoading(false);
    }

    load();
  }, [turnoId, token]);

  // autosave
  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(async () => {
      setSaving(true);

      await fetch(`${API}/pre-informes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          turnoId,
          textoPorPractica: [],
          observacionGeneral: texto,
        }),
      });

      setSaving(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [texto, turnoId, token, loading]);

  return { texto, setTexto, saving };
}
