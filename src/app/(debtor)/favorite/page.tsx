"use client";

import { useState, useEffect } from "react";
import { message, Modal, App } from "antd";
import { useAuth } from "@/contexts/authContext";
import {
  getFavoriteProperties,
  removeFromFavorites,
} from "@/services/favoriteService";
import { FavoriteProperty } from "@/types/favorite";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Pagination from "@/app/(debtor)/developers/components/Pagination";
import Image from "next/image";

// --- Ikon SVG sebagai Komponen React ---
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
    width="24"
    height="24"
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

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-600"
  >
    <path d="M2 4v16h20V4Z" />
    <path d="M2 10h20" />
  </svg>
);
const BathIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-600"
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
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-600"
  >
    <path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);
const LandAreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-600"
  >
    <path d="M21.2,12.3H20V9.8c0-1.1-0.9-2-2-2h-2.5V5.8c0-1.1-0.9-2-2-2h-5c-1.1,0-2,0.9-2,2v2H3.8c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2v-2.5h1.2c0.7,0,1.2-0.5,1.2-1.2V13.5C22.5,12.8,21.9,12.3,21.2,12.3z M18.8,20H3.8c-0.6,0-1-0.4-1-1v-9.2c0-0.6,0.4-1,1-1h15c0.6,0,1,0.4,1,1V20z" />
    <path d="M11.5,15.3h-5c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h5c0.3,0,0.5,0.2,0.5,0.5v5C12,15.1,11.8,15.3,11.5,15.3z" />
  </svg>
);

const PropertyCard: React.FC<{
  property: FavoriteProperty;
  onRemove: (favoriteId: number) => void;
}> = ({ property, onRemove }) => {
  const handleRemove = async () => {
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

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col relative">
      <div
        className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full z-10 cursor-pointer"
        onClick={handleRemove}
      >
        <StarIconFilled />
      </div>
      <div className="relative w-full h-48">
        <Image
          src={property.propertyPhoto || "/placeholder-property.jpg"}
          alt={property.name}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-teal-700">{property.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{property.developer}</p>
        <p className="text-sm text-gray-500 mb-4">{property.location}</p>

        {/* Price */}
        <div className="my-4">
          <p className="text-xs text-gray-500">Harga</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            Rp {formatPrice(property.price)}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700">
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
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      }
    });
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
        <div className="bg-light-tosca min-h-screen font-sans flex items-center justify-center">
          <div className="text-gray-600">Memuat data favorit...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-light-tosca min-h-screen font-sans">
        <main className="flex flex-col items-center justify-center max-w-[1200px] mx-8 lg:mx-auto py-12">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center mb-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentFavorites.map((property) => (
                  <PropertyCard
                    key={property.favoriteId}
                    property={property}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || totalPages <= 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
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
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages <= 1}
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
