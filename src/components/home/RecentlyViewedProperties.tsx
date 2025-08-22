"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { axiosServer } from "@/utils/axios";
import Link from "next/link";
import Image from "next/image";

export default function RecentlyViewedProperties() {
  const { user, token } = useAuth();
  const [properties, setProperties] = useState<RecentlyViewedProperty[]>([]);

  useEffect(() => {
    async function getRecentlyViewedProperties(): Promise<void> {
      try {
        const response = await axiosServer.get(
          "/properties/recently-viewed-properties",
          {
            params: {
              userId: user?.userId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: RecentlyViewedProperty[] =
          response.data?.data?.recentlyViewedProperties;
        console.log(data);
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch recently viewed properties:", error);
      }
    }

    if (user) {
      getRecentlyViewedProperties();
    }
  }, [user]);

  if (!user || properties.length === 0) return <></>;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Terakhir Dilihat</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((prop) => (
          <RecentlyViewedPropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
}

const RecentlyViewedPropertyCard: React.FC<{
  property: RecentlyViewedProperty;
}> = ({ property }) => (
  <Link
    href={`/developers/${property.developerId}/clusters/${property.clusterId}/properties/${property.id}`}
    className="block bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg h-full relative"
  >
    <div className="relative w-full h-48 bg-gray-200">
      <Image
        src={
          property.photoUrl ||
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        }
        alt={property.propertyName}
        layout="fill"
        objectFit="cover"
      />
      {/* Last viewed label */}
      <span className="absolute top-2 right-2 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
        {formatLastViewed(property.lastViewed)}
      </span>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-gray-800 truncate">
        {property.propertyName}
      </h4>
      <p className="text-sm text-gray-500 mt-1">{property.location}</p>
      <p className="text-lg font-bold text-teal-600 mt-3">
        Rp {Number(property.price).toLocaleString("id-ID")}
      </p>
    </div>
  </Link>
);

type RecentlyViewedProperty = {
  id: number;
  developerId: number;
  clusterId: number;
  clusterName: string;
  propertyName: string;
  location: string;
  price: string;
  photoUrl: string | null;
  lastViewed: string;
};

function formatLastViewed(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Hitung selisih waktu dalam milidetik
  const diffMs = now.getTime() - date.getTime();

  // Konversi ke hari, bulan, tahun
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  const diffYears = now.getFullYear() - date.getFullYear();

  if (diffDays === 0) {
    return "Dilihat hari ini";
  } else if (diffDays === 1) {
    return "Dilihat 1 hari yang lalu";
  } else if (diffDays < 7) {
    return `Dilihat ${diffDays} hari yang lalu`;
  } else if (diffDays < 14) {
    return "Dilihat minggu lalu";
  } else if (diffMonths === 1) {
    return "Dilihat bulan lalu";
  } else if (diffMonths < 12) {
    return `Dilihat ${diffMonths} bulan yang lalu`;
  } else if (diffYears === 1) {
    return "Dilihat tahun lalu";
  } else {
    return `Dilihat ${diffYears} tahun yang lalu`;
  }
}
