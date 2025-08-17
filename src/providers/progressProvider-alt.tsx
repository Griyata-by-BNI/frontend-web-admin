"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div
          className="fixed top-0 left-0 z-50 h-1 bg-[#30a5a2] transition-all duration-300"
          style={{
            width: "100%",
            animation: "progress 0.3s ease-in-out",
          }}
        />
      )}
      {children}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </>
  );
}