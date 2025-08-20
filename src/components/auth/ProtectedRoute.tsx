"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      router.push(redirectTo);
    }
  }, [user, token, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 w-full flex items-center justify-center p-4 min-h-screen">
        <div className="text-gray-600">Memuat...</div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="bg-gray-50 w-full flex items-center justify-center p-4 min-h-screen">
        <div className="text-gray-600">Mengalihkan ke halaman login...</div>
      </div>
    );
  }

  return <>{children}</>;
}