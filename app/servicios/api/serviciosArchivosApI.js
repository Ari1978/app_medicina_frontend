

// 🔒 Validación temprana de entorno
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_URL");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// ======================================================
// LISTAR ARCHIVOS DEL SERVICIO
// ======================================================
export async function listarArchivosServicio(servicioId) {
  const res = await fetch(
    `${API_URL}/api/servicios/archivos?servicioId=${servicioId}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    throw new Error("Error al listar archivos");
  }

  return res.json();
}

// ======================================================
// SUBIR ARCHIVO (FORMDATA)
// ======================================================
export async function subirArchivoServicio({ servicioId, area, file }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("servicioId", servicioId);
  formData.append("area", area);

  const res = await fetch(
    `${API_URL}/api/servicios/archivos/upload`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Error al subir archivo");
  return res.json();
}

// ======================================================
// SUBIR ARCHIVO CON PROGRESO (XHR)
// ======================================================
export function subirArchivoServicioConProgreso(
  servicioId,
  file,
  onProgress
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("servicioId", servicioId);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve({});
        }
      } else {
        reject(new Error("Error al subir archivo"));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Error de red al subir archivo"));

    xhr.open(
      "POST",
      `${API_URL}/api/servicios/archivos/upload`
    );
    xhr.withCredentials = true;
    xhr.send(formData);
  });
}

// ======================================================
// ELIMINAR ARCHIVO (SOFT DELETE)
// ======================================================
export async function eliminarArchivoServicio(archivoId) {
  const res = await fetch(
    `${API_URL}/api/servicios/archivos/${archivoId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error al eliminar archivo");
  }

  return res.json();
}

// ======================================================
// DESCARGAR ARCHIVO
// ======================================================
export async function descargarArchivoServicio(id, filename) {
  const res = await fetch(
    `${API_URL}/api/servicios/archivos/${id}/download`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Error al descargar archivo");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}

// ======================================================
// PREVIEW INLINE
// ======================================================
export function getPreviewUrl(id) {
  return `${API_URL}/api/servicios/archivos/${id}/preview`;
}
