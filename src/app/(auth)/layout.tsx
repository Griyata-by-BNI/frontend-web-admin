"use client";

import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      redirect("/");
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
