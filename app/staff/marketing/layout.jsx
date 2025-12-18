
"use client";

export default function MarketingLayout({ children }) {
  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">
            Panel de Marketing
          </h1>

          <a
            href="/marketing/login"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Cerrar sesión
          </a>
        </header>

        {children}
      </div>
    </main>
  );
}
