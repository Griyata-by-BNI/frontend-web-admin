"use client";

import FooterDebtor from "@/components/FooterDebtor";
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

      <main className="flex-grow bg-light-tosca">
        <div className="flex flex-col md:px-0 pb-20">{children}</div>
      </main>

      <FooterDebtor />
    </div>
  );
}
