"use client";

import Link from "next/link";
import StickyCard from "../../../_components/StickyCard";
import FavoriteButton from "@/components/FavoriteButton";

interface PropertySidebarProps {
  property: any;
  propertyId: number;
  userId?: number;
  developerLogo: string;
}

export default function PropertySidebar({
  property,
  propertyId,
  userId,
  developerLogo,
}: PropertySidebarProps) {
  return (
    <div className="lg:col-span-1 mt-8 lg:mt-0">
      <div className="sticky top-20 space-y-4">
        <StickyCard
          priceLabel="Harga"
          price={`${Intl.NumberFormat("id-ID").format(
            Number(property.price) || 0
          )}`}
          minPrice={property.price}
          stock={property.stock}
          developerName={property.developerName}
          location={property.collateralAddress || "Alamat tidak tersedia"}
          developerPhotoUrl={developerLogo}
        />

        <div className="flex gap-3">
          <Link
            href={`/kpr-apply?property_id=${propertyId}`}
            className="flex-1"
          >
            <button className="cursor-pointer w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-lg font-semibold rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg">
              Ajukan KPR
            </button>
          </Link>

          {userId && (
            <FavoriteButton propertyId={property.id} userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
}
