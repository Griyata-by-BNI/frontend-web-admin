"use client";

import { useAuth } from "@/contexts/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DefaultPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.replace("/login");
    } else if (user.role === "ADMIN") {
      router.replace("/admin/developer-management");
    } else if (user.role === "SALES") {
      router.replace("/sales/approval-list");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return null;
}
