


export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-20 py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* INFORMACIÓN */}
        <div>
          <h4 className="text-xl font-bold mb-3">ASMEL</h4>
          <p>Plataforma integral de medicina laboral para empresas.</p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Secciones</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Inicio</a></li>
            <li><a href="/servicios" className="hover:underline">Servicios</a></li>
            <li><a href="/empresa/login" className="hover:underline">Empresa</a></li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contacto</h4>
          <p>Email: info@asmelempleos.com</p>
          <p>Tel: +54 11 1111-2222</p>
        </div>
      </div>

      <div className="text-center mt-10 text-sm opacity-70">
        © {new Date().getFullYear()} ASMEL – Medicina Laboral
      </div>
    </footer>
  );
}
