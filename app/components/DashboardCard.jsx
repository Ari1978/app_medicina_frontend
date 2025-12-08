"use client";

import { Card } from "@/app/components/ui/card";

export default function DashboardCard({ title, icon, children }) {
  return (
    <Card
      className="
        p-3 sm:p-4 md:p-6
        bg-white/80
        backdrop-blur-md
        border border-white/40
        shadow-md md:shadow-xl
        rounded-lg sm:rounded-xl
        transition
      "
    >
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div className="text-blue-700 text-2xl md:text-3xl">
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold">
          {title}
        </h3>
      </div>

      {children}
    </Card>
  );
}
