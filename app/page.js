import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1580281657526-7a4b16e1b8a0?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center justify-center flex-col text-white text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Medicina Laboral para Empresas
          </h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            Turnos, exámenes preocupacionales, estudios, asesoramiento y control
            integral del personal. Todo en una sola plataforma.
          </p>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">
            Más información
          </button>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-10">
          Nuestros Servicios
        </h3>

        <div className="grid md:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <img
              src="https://images.unsplash.com/photo-1580281657661-3d0f20abf97a?auto=format&fit=crop&w=800&q=80"
              className="rounded-lg mb-4 h-40 w-full object-cover"
            />
            <h4 className="text-xl font-bold mb-2">Exámenes Preocupacionales</h4>
            <p>
              Evaluaciones médicas completas para ingreso laboral según normas vigentes.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <img
              src="https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=800&q=80"
              className="rounded-lg mb-4 h-40 w-full object-cover"
            />
            <h4 className="text-xl font-bold mb-2">Estudios Complementarios</h4>
            <p>
              Electrocardiogramas, Rx de tórax, laboratorio, audiometrías y más.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <img
              src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80"
              className="rounded-lg mb-4 h-40 w-full object-cover"
            />
            <h4 className="text-xl font-bold mb-2">Asesoramiento Laboral</h4>
            <p>
              Informes, capacitaciones, asesoramiento técnico y gestión de riesgos laborales.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
