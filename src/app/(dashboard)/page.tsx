"use client";

import { useAuth } from "@/contexts/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DefaultPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user && user.role === "ADMIN") {
      router.replace("/admin/developer-management");
      return;
    }

    if (user && user.role === "SALES") {
      router.replace("/sales/approval-list");
      return;
    }

    router.replace("/login");
  }, [user, router]);

  return null;
}
