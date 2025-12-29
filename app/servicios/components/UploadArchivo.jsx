"use client";

import { useState } from "react";

export default function UploadArchivo({ titulo, endpoint, accept }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);
      setMsg("");

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Error al subir archivo");
        return;
      }

      setMsg("Archivo subido correctamente");
      setFile(null);
    } catch {
      setMsg("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 border p-6 rounded-xl">
      <h2 className="font-semibold">{titulo}</h2>

      <input
        type="file"
        accept={accept}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Subiendo..." : "Subir"}
      </button>

      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
