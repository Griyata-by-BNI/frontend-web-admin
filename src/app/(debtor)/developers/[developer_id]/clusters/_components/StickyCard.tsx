"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import calculateInstallment from "@/utils/calculateInstallment";

interface StickyCardProps {
  priceLabel: string;
  price: string;
  minPrice?: string;
  developerName: string;
  location: string;
  developerPhotoUrl: string;
  stock?: number;
}

const StickyCard: React.FC<StickyCardProps> = ({
  priceLabel,
  price,
  developerName,
  location,
  minPrice,
  developerPhotoUrl,
  stock,
}) => {
  const installment = useMemo(() => {
    return calculateInstallment(minPrice);
  }, [minPrice]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-fit border border-gray-200">
      <div className="h-4 bg-gradient-to-r from-teal-400 to-dark-tosca"></div>

      <div className="p-6 py-10">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">{priceLabel}</p>

          {stock !== undefined && (
            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              <span className="font-semibold">Stok: {stock} unit</span>
            </div>
          )}
        </div>

        <p className="text-3xl font-extrabold text-primary-tosca mt-1">
          {price}
        </p>

        <p className="text-sm text-gray-700 flex items-center gap-1 mt-2">
          Angsuran mulai dari
          <span className="text-sm font-bold text-gray-900">
            {installment} / bulan
          </span>
        </p>

        <div className="my-4 border-t border-gray-300"></div>

        <p className="text-sm text-gray-500 mb-2">Developer:</p>

        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 bg-white border border-gray-200 rounded-lg overflow-clip">
            <Image
              src={
                developerPhotoUrl ||
                "https://via.placeholder.com/150x50.png?text=Logo"
              }
              alt="Developer Logo"
              layout="fill"
              objectFit="contain"
              objectPosition="left"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-900">{developerName}</p>

            <p className="text-gray-500 text-sm">{location}</p>
          </div>
        </div>
      </div>

      <div className="h-4 bg-gradient-to-r from-teal-400 to-dark-tosca"></div>
    </div>
  );
};

export default StickyCard;
