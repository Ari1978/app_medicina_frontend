import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ASMEL",
  description: "Plataforma de Medicina Laboral",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ PROVIDERS VAN ACÁ */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
