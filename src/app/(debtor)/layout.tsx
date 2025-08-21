"use client";

import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export default function DebtorLayout({
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

      <main className="flex-grow bg-gradient-to-t from-white to-light-tosca">
        <div className="flex flex-col lg:max-w-6xl mx-8 lg:mx-auto py-4 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
