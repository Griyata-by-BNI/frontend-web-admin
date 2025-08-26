"use client";

import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);

  return <>{children}</>;
}
