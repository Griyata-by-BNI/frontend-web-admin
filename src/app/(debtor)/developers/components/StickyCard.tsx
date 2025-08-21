"use client";

import React from "react";
import Image from "next/image";

interface StickyCardProps {
  priceLabel: string;
  price: string;
  installmentText?: string;
  developerName: string;
  location: string;
  developerPhotoUrl: string;
  stock?: number;
}

const StickyCard: React.FC<StickyCardProps> = ({
  priceLabel,
  price,
  installmentText,
  developerName,
  location,
  developerPhotoUrl,
  stock,
}) => {
  return (
    <div className="lg:col-span-1 mt-8 lg:mt-0">
      <div className="sticky top-20">
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-teal-400 to-dark-tosca"></div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-teal-700">{priceLabel}</p>
              {stock !== undefined && (
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  <span className="font-semibold">Stok: {stock} unit</span>
                </div>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-1">{price}</p>
            {installmentText && (
              <p className="text-sm text-teal-700 mt-2">{installmentText}</p>
            )}
            <div className="my-3 border-t border-dark-tosca"></div>
            <p className="text-lg font-bold text-gray-900">{developerName}</p>
            <p className="text-gray-500 text-sm mt-1">{location}</p>
            <div className="my-3 border-t border-dark-tosca"></div>
            <p className="text-sm text-gray-500 mb-2">Developer:</p>
            <div className="relative h-16">
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
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-teal-400 to-dark-tosca"></div>
        </div>
      </div>
    </div>
  );
};

export default StickyCard;