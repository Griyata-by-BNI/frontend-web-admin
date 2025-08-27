"use client";

import { useAuth } from "@/contexts/authContext";
import { redirect, useRouter } from "next/navigation";

export default function DefaultPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
