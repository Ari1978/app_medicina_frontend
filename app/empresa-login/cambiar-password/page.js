import { Suspense } from "react";
import CambiarPasswordClient from "../../components/CambiarPassswordClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <CambiarPasswordClient />
    </Suspense>
  );
}
