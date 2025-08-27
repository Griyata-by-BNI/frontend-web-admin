"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export default function DefaultPage() {
  const { user } = useAuth();

  if (user) {
    if (user.role === "ADMIN") {
      redirect("/admin/developer-management");
    }

    if (user.role === "SALES") {
      redirect("/sales/approval-list");
    }
  } else {
    redirect("/login");
  }

  return <></>;
}
