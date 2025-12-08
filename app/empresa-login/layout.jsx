"use client";

import { AuthProvider } from "@/app/context/AuthContext";

export default function EmpresaLoginLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
