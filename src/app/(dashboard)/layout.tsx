"use client";

import { useAuth } from "@/contexts/authContext";
import { IdleTimeProvider } from "@/contexts/IdleTimeContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  return (
    <IdleTimeProvider
      timeoutMs={120_000}
      onIdle={() => logout("idle")}
      debug={false}
    >
      {children}
    </IdleTimeProvider>
  );
}
