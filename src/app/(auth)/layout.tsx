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

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <div className="flex flex-col">{children}</div>

      {/* Footer */}
      <footer className="bg-teal-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white mb-1">Butuh Informasi Lebih Lanjut?</p>
          <h3 className="text-xl font-bold text-white">BNI Call - 1500046</h3>
        </div>
      </footer>
    </div>
  );
}
