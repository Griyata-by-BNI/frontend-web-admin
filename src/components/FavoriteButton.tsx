"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/authContext";
import {
  getFavoriteProperties,
  addToFavorites,
  removeFromFavorites,
} from "@/services/favoriteService";
import { Tooltip } from "antd";

interface FavoriteButtonProps {
  propertyId: number;
  userId?: number;
}

export default function FavoriteButton({
  propertyId,
  userId,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const currentUserId =
    userId || (user?.userId ? Number(user.userId) : undefined);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentUserId) return;

      try {
        const favorites = await getFavoriteProperties(Number(currentUserId));
        const favorite = favorites.find((fav) => fav.propertyId === propertyId);
        if (favorite) {
          setIsFavorited(true);
          setFavoriteId(favorite.favoriteId);
        }
      } catch (error) {
        console.error("Failed to check favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [propertyId, currentUserId]);

  const handleFavorite = async () => {
    if (!currentUserId) {
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited && favoriteId) {
        await removeFromFavorites(favoriteId, Number(currentUserId));
        setIsFavorited(false);
        setFavoriteId(null);
      } else {
        await addToFavorites({ userId: Number(currentUserId), propertyId });
        setIsFavorited(true);
        // Refresh to get the new favoriteId
        const favorites = await getFavoriteProperties(Number(currentUserId));
        const favorite = favorites.find((fav) => fav.propertyId === propertyId);
        if (favorite) setFavoriteId(favorite.favoriteId);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      alert("Failed to update favorite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip title="Tambahkan ke favorit">
      <button
        onClick={handleFavorite}
        disabled={isLoading}
        className="cursor-pointer w-12 h-12 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center hover:bg-teal-50 transition-all duration-200 shadow-lg disabled:opacity-50"
      >
        <FontAwesomeIcon
          icon={faStar}
          className={`!w-6 !h-6 ${
            isFavorited ? "text-yellow-500" : "text-gray-300"
          }`}
        />
      </button>
    </Tooltip>
  );
}
