import jsPDF from "jspdf";

export function generarPdfRecepcion(data) {
  const doc = new jsPDF();

  let y = 20;

  // TÍTULO
  doc.setFontSize(16);
  doc.text("Ficha de Recepción - ASMEL", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(11);

  // DATOS GENERALES
  doc.text(`Protocolo: ${data.protocolo}`, 20, y); y += 7;
  doc.text(`Fecha: ${data.fecha}`, 20, y); y += 7;
  doc.text(`Hora: ${data.hora}`, 20, y); y += 10;

  // PACIENTE
  doc.setFont(undefined, "bold");
  doc.text("Paciente", 20, y); y += 6;
  doc.setFont(undefined, "normal");

  doc.text(`Nombre: ${data.paciente}`, 20, y); y += 6;
  doc.text(`DNI: ${data.dni}`, 20, y); y += 10;

  // EMPRESA
  doc.setFont(undefined, "bold");
  doc.text("Empresa", 20, y); y += 6;
  doc.setFont(undefined, "normal");

  doc.text(data.empresa || "-", 20, y); y += 10;

  // ESTUDIOS
  doc.setFont(undefined, "bold");
  doc.text("Estudios solicitados", 20, y); y += 6;
  doc.setFont(undefined, "normal");

  if (data.estudios.length === 0) {
    doc.text("-", 20, y);
  } else {
    data.estudios.forEach((e) => {
      doc.text(`• ${e}`, 25, y);
      y += 6;
    });
  }

  // PIE
  y += 15;
  doc.setFontSize(9);
  doc.text(
    "Documento administrativo - ASMEL",
    105,
    y,
    { align: "center" }
  );

  // ABRIR PDF
  doc.output("bloburl");
}
