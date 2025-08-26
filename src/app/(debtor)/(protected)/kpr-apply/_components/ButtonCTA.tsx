"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ButtonCTA() {
  const params = useSearchParams();
  const propertyId = params.get("property_id") || "";

  return (
    <Link
      href={{
        pathname: "/kpr-apply/form",
        query: propertyId ? { property_id: propertyId } : undefined,
      }}
    >
      <button className="w-full max-w-sm bg-teal-500 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg">
        Ajukan Sekarang
      </button>
    </Link>
  );
}
