"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export default function SalesDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user && user.role !== "SALES") {
    if (user.role === "DEBTOR") {
      redirect("/");
    }

    if (user.role === "ADMIN") {
      redirect("/admin/developer-management");
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar type="sales" />

      <main className="flex-1 px-8 py-6 min-h-screen bg-white overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
