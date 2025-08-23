"use client";

import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user && user.role !== "DEBTOR") {
    if (user.role === "ADMIN") {
      redirect("/admin/developer-management");
    }

    if (user.role === "SALES") {
      redirect("/sales/approval-list");
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main className="flex-grow bg-white">
        <div className="flex flex-col custom-container">{children}</div>
      </main>
    </div>
  );
}
