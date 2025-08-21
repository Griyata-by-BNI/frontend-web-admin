"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faShower,
  faHouse,
  faChartArea,
} from "@fortawesome/free-solid-svg-icons";

export interface Facility {
  name: "KT" | "KM" | "LB" | "LT";
  value: number;
}

export interface Property {
  id: number;
  developerId: number;
  clusterId: number;
  location: string;
  propertyName: string;
  developerName: string;
  price: number;
  installment?: number;
  facilities: Facility[];
  updatedAt: string;
  photoUrl: string | null;
  property_photo_urls?: string[];
  distanceKm?: number;
  clusterTypeName?: string;
}

// --- IKON SVG KHUSUS UNTUK CARD ---
const LocationPinIcon = () => (
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

// --- KOMPONEN PROPERTY CARD ---
const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  // --- FUNGSI HELPER (Tetap di dalam atau pindah ke file utils jika digunakan di banyak tempat) ---
  const getFacilityValue = (name: Facility["name"]): number | string =>
    property.facilities.find((f) => f.name === name)?.value ?? "N/A";

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000)
      return `Rp ${(amount / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
    if (amount >= 1_000_000)
      return `Rp ${(amount / 1_000_000).toFixed(1).replace(".0", "")} JT`;
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const formatInstallment = (amount: number) => {
    if (amount >= 1000000)
      return `Rp ${(amount / 1000000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} jt`;
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000
    );
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} tahun lalu`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} bulan lalu`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} hari lalu`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} jam lalu`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} menit lalu`;
    return `beberapa detik lalu`;
  };

  const calculateInstallment = (
    price?: string | null,
    tenor: number = 180, //default
    dpPercent: number = 10, // default 10%
    annualInterest: number = 3.25 // default 3.25%
  ) => {
    if (!price) return "N/A";
    // Parses the price string to a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum === 0) return "-";

    const dp = priceNum * (dpPercent / 100);
    const loanPrincipal = priceNum - dp;
    const monthlyInterest = annualInterest / 12 / 100;

    const n = tenor; // number of payments
    const r = monthlyInterest; // monthly interest rate

    // Annuity formula to calculate the monthly installment
    const installment = loanPrincipal * (r / (1 - Math.pow(1 + r, -n)));

    // Formats the output string based on the installment amount
    if (installment >= 1_000_000) {
      const million = installment / 1_000_000;
      // Displays the amount in millions (Juta), e.g., "Rp 1.5 JT"
      return (
        "Rp " +
        (million % 1 === 0 ? `${million}` : `${million.toFixed(1)}`) +
        " JT"
      );
    } else if (installment >= 1_000) {
      const thousand = installment / 1_000;
      // Displays the amount in thousands (Ribu), e.g., "Rp 500 RB"
      return (
        "Rp " +
        (thousand % 1 === 0 ? `${thousand}` : `${thousand.toFixed(1)}`) +
        " RB"
      );
    }
    // Displays the rounded amount for values less than 1000
    return "Rp " + Math.round(installment).toLocaleString("id-ID");
  };

  const monthlyInstallment = calculateInstallment(property.price.toString());

  // --- RENDER JSX ---
  return (
    <Link
      href={`/developers/${property.developerId}/clusters/${property.clusterId}/properties/${property.id}`}
    >
      <div className="min-w-[360px] bg-white rounded-2xl shadow-lg shadow-gray-500/10 overflow-hidden hover:shadow-primary-tosca/30 flex flex-col h-full">
        <div className="relative w-full h-56 bg-gray-100">
          {property.property_photo_urls &&
          property.property_photo_urls.length > 0 ? (
            <div className="h-full relative z-10 group">
              <Carousel
                dots
                arrows
                className="h-full [&_.slick-prev]:!left-2 [&_.slick-next]:!right-2 [&_.slick-prev]:!z-30 [&_.slick-next]:!z-30 [&_.slick-prev]:!bg-white/90 [&_.slick-next]:!bg-white/90 [&_.slick-prev]:!rounded-full [&_.slick-next]:!rounded-full [&_.slick-prev]:!w-10 [&_.slick-next]:!w-10 [&_.slick-prev]:!h-10 [&_.slick-next]:!h-10 [&_.slick-prev]:!flex [&_.slick-next]:!flex [&_.slick-prev]:!items-center [&_.slick-next]:!items-center [&_.slick-prev]:!justify-center [&_.slick-next]:!justify-center [&_.slick-prev]:!shadow-lg [&_.slick-next]:!shadow-lg [&_.slick-prev]:hover:!bg-white [&_.slick-next]:hover:!bg-white [&_.slick-prev]:!text-gray-700 [&_.slick-next]:!text-gray-700 [&_.slick-dots]:!z-20"
              >
                {property.property_photo_urls.map((src, idx) => (
                  <div key={idx} className="relative w-full h-56">
                    <Image
                      src={src}
                      alt={`property-photo-${idx + 1}`}
                      layout="fill"
                      objectFit="cover"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <Image
              src={
                property.photoUrl ||
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
              }
              alt={property.propertyName}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm text-teal-700">
              <LocationPinIcon />
              <span className="ml-1">{property.location}</span>
              {property.distanceKm && (
                <span className="ml-2 text-xs bg-light-tosca text-dark-tosca px-2 py-1 rounded-full">
                  {property.distanceKm.toFixed(1)} km
                </span>
              )}
            </div>
            <div className="text-xs bg-teal-500 text-white font-semibold px-3 py-1 rounded-full">
              {getTimeAgo(property.updatedAt)}
            </div>
          </div>
          <h3
            className="text-xl font-bold text-gray-900 truncate"
            title={property.clusterTypeName ? `${property.clusterTypeName} - ${property.propertyName}` : property.propertyName}
          >
            {property.clusterTypeName ? `${property.clusterTypeName} - ${property.propertyName}` : property.propertyName}
          </h3>
          <p className="text-sm text-gray-500">{property.developerName}</p>
          <div className="my-4 flex items-center py-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Harga</p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(property.price ?? 0)}
              </p>
            </div>
            <div className="h-10 w-px bg-gray-200 mx-4"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Angsuran mulai dari</p>
              <p className="text-xl font-bold text-gray-800">
                {monthlyInstallment}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  /bulan
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBed} className="w-4 text-gray-500" />
              <span>KT: {getFacilityValue("KT")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faHouse} className="w-4 text-gray-500" />
              <span>LB: {getFacilityValue("LB")} m²</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShower} className="w-4 text-gray-500" />
              <span>KM: {getFacilityValue("KM")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faChartArea}
                className="w-4 text-gray-500"
              />
              <span>LT: {getFacilityValue("LT")} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
