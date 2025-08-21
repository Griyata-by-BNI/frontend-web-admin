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
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !token)) {
      router.push(redirectTo);
    }
  }, [user, token, loading, router, redirectTo]);

  if (loading) {
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
