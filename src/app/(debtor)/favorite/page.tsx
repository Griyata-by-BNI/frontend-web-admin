"use client";

import { useState, useEffect } from "react";
import { message, App } from "antd";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import {
  getFavoriteProperties,
  removeFromFavorites,
} from "@/services/favoriteService";
import { FavoriteProperty } from "@/types/favorite";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Image from "next/image";

const StarIconLarge = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-500"
  >
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="#14b8a6"
      stroke="#fff"
    />
  </svg>
);

const StarIconFilled = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#14b8a6"
    stroke="#fff"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-600"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M2 4v16h20V4Z" />
    <path d="M2 10h20" />
  </svg>
);

const BathIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0L2 6" />
    <path d="m2 16 6 6" />
    <path d="M22 16 16 22" />
    <path d="M17 11h.01" />
    <path d="M15 13h.01" />
    <path d="M13 15h.01" />
    <path d="M22 8 12 18" />
    <path d="M15 3 5 13" />
    <path d="M22 8a6 6 0 0 0-8.49-8.49" />
  </svg>
);

const BuildingAreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

const LandAreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M3 12h18l-3-3m0 6l3-3" />
    <path d="M3 5v14" />
    <path d="M21 5v14" />
  </svg>
);

const PropertyCard: React.FC<{
  property: FavoriteProperty;
  onRemove: (favoriteId: number) => void;
  onClick: () => void;
}> = ({ property, onRemove, onClick }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(property.favoriteId);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000000) {
      return `${(numPrice / 1000000000).toFixed(1)} M`;
    } else if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(0)} JT`;
    }
    return price;
  };

  const formatInstallment = (price: string) => {
    const numPrice = parseFloat(price);
    const installment = numPrice / 240; // 20 years
    if (installment >= 1000000) {
      return `${(installment / 1000000).toFixed(1)} JT`;
    }
    return `${(installment / 1000).toFixed(0)} RB`;
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer relative"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-48">
        <Image
          src={property.propertyPhoto || "/placeholder-property.jpg"}
          alt={property.name}
          fill
          className="object-cover"
        />
        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors z-10"
          onClick={handleRemove}
        >
          <StarIconFilled />
        </button>
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            5 hari lalu
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <LocationIcon />
          <span className="text-sm text-teal-600 font-medium">
            {property.location}
          </span>
        </div>

        {/* Property Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {property.name}
        </h3>

        {/* Developer */}
        <p className="text-sm text-gray-500 mb-4">{property.developer}</p>

        {/* Price Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Harga</p>
            <p className="text-lg font-bold text-gray-900">
              Rp {formatPrice(property.price)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Angsuran mulai dari</p>
            <p className="text-lg font-bold text-gray-900">
              Rp {formatInstallment(property.price)}{" "}
              <span className="text-sm font-normal text-gray-500">/bulan</span>
            </p>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BedIcon />
            <span>KT: {property.kamarTidur}</span>
          </div>
          <div className="flex items-center gap-2">
            <BuildingAreaIcon />
            <span>LB: {property.buildingArea} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <BathIcon />
            <span>KM: {property.kamarMandi}</span>
          </div>
          <div className="flex items-center gap-2">
            <LandAreaIcon />
            <span>LT: {property.landArea} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function FavoritePage() {
  const { user } = useAuth();
  const { modal } = App.useApp();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      try {
        const data = await getFavoriteProperties(parseInt(user.userId));
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        message.error("Gagal memuat data favorit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (favoriteId: number) => {
    if (!user?.userId) return;

    modal.confirm({
      title: "Hapus dari Favorit",
      content: "Apakah kamu yakin ingin menghapus properti ini dari favorite?",
      okText: "Hapus",
      cancelText: "Tidak",
      okType: "danger",
      onOk: async () => {
        try {
          const success = await removeFromFavorites(
            favoriteId,
            parseInt(user.userId)
          );
          if (success) {
            setFavorites((prev) =>
              prev.filter((fav) => fav.favoriteId !== favoriteId)
            );
            message.success("Properti berhasil dihapus dari favorit");
          } else {
            message.error("Gagal menghapus dari favorit");
          }
        } catch (error) {
          console.error("Error removing favorite:", error);
          message.error("Terjadi kesalahan saat menghapus favorit");
        }
      },
    });
  };

  const handlePropertyClick = (property: FavoriteProperty) => {
    // Navigate to property detail page
    // Format: /developers/{developerId}/clusters/{clusterId}/properties/{propertyId}
    router.push(
      `/developers/${property.developerId}/clusters/${property.clusterId}/properties/${property.propertyId}`
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = favorites.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen font-sans flex items-center justify-center">
          <div className="text-gray-600">Memuat data favorit...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen font-sans">
        <main className="flex flex-col items-center justify-center max-w-[1200px] mx-8 lg:mx-auto py-12">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center mb-4 mt-[-48px]">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <StarIconLarge />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Rumah Favorite Anda!
            </h1>
            <p className="text-gray-600 mt-2">
              Pantau properti yang Anda sukai dan kunjungi kembali kapan saja
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Properti Favorit
              </h3>
              <p className="text-gray-500 mb-4">
                Anda belum menambahkan properti apapun ke daftar favorit
              </p>
              <p className="text-sm text-gray-400">
                Jelajahi properti dan klik ikon ⭐ untuk menambahkannya ke
                favorit
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFavorites.map((property) => (
                  <PropertyCard
                    key={property.favoriteId}
                    property={property}
                    onRemove={handleRemoveFavorite}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? "bg-teal-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function AppWrapper() {
  return (
    <App>
      <FavoritePage />
    </App>
  );
}
