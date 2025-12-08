
"use client";

import StaffLoginForm from "../components/StaffLoginForm";

export default function StaffLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login Staff
        </h1>
        <StaffLoginForm />
      </div>
    </main>
  );
}
