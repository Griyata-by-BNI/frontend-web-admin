"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user && user.role !== "ADMIN") {
    if (user.role === "SALES") {
      redirect("/sales/approval-list");
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar type="admin" />

      <main className="flex-1 px-4 md:px-8 py-6 min-h-screen bg-white overflow-y-auto">
        <div className="p-4 md:p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
