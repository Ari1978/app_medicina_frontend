"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export default function PrintTurno() {
  const { id } = useParams(); // ✅ FORMA CORRECTA
  const [turno, setTurno] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/api/staff/recepcion/turnos/${id}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setTurno)
      .catch(console.error);
  }, [id]);

  // 🖨️ Auto imprimir
  useEffect(() => {
    if (turno) {
      setTimeout(() => window.print(), 500);
    }
  }, [turno]);

  if (!turno) return null;

  return (
    <main className="print-page">
      <header className="header">
        <h1>Clínica ASMEL</h1>
        <p>Orden de Examen Médico</p>
      </header>

      <section className="datos">
        <div><strong>Apellido y Nombre:</strong> {turno.empleadoApellido} {turno.empleadoNombre}</div>
        <div><strong>DNI:</strong> {turno.empleadoDni}</div>
        <div><strong>Empresa:</strong> {turno.empresa?.razonSocial}</div>
        <div><strong>Puesto:</strong> {turno.puesto || "—"}</div>
        <div><strong>Fecha impresión:</strong> {new Date().toLocaleString()}</div>
      </section>

      <section className="practicas">
        <h3>Prácticas</h3>
        {turno.listaPracticas.map((p) => (
          <div key={p.codigo} className="fila">
            <span>{p.nombre || "Práctica"}</span>
            <span>{p.codigo}</span>
          </div>
        ))}
      </section>

      <footer className="footer">
        Documento generado por sistema ASMEL
      </footer>

      <style jsx global>{`
        @page {
          size: 148mm 210mm;
          margin: 12mm;
        }

        body {
          background: white;
        }

        .print-page {
          font-family: system-ui, Arial;
          color: #111;
        }

        .header {
          border-bottom: 2px solid #2563eb;
          margin-bottom: 12px;
        }

        .header h1 {
          margin: 0;
          font-size: 20px;
          color: #2563eb;
        }

        .header p {
          margin: 0;
          font-size: 12px;
        }

        .datos {
          margin-bottom: 12px;
          font-size: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .practicas h3 {
          margin-bottom: 6px;
          font-size: 14px;
        }

        .fila {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #ccc;
          padding: 4px 0;
          font-size: 12px;
        }

        .footer {
          margin-top: 20px;
          font-size: 10px;
          text-align: center;
          color: #555;
        }
      `}</style>
    </main>
  );
}
