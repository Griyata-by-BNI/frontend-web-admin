"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

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
    className="text-gray-600"
  >
    <path d="M2 4v16h20V4Z" />
    <path d="M2 10h20" />
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
    className="text-gray-600"
  >
    <path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const MasjidIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 20v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
    <path d="M12 2v12" />
    <path d="M9 14h6" />
    <path d="M12 18a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4z" />
  </svg>
);

const CommunityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ParkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <path d="m12 11-3 3 4 2 3-3-4-2z" />
  </svg>
);

const GymIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 8 4 4-4 4" />
    <path d="M18 8h-5" />
    <path d="M18 12h-5" />
    <path d="M18 16h-5" />
  </svg>
);

const LocationPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// --- Definisi Tipe Data ---
interface PropertyType {
  id: string; // e.g., "tipe-a"
  name: string;
  imageUrl: string;
  price: string;
  installment: string;
  bedrooms: number;
  buildingArea: number;
}

interface HousingDetails {
  developerId: string;
  clusterId: string;
  name: string;
  mainImageUrl: string;
  description: string;
  priceRange: string;
  installment: string;
  developer: string;
  subLocation: string;
  location: string;
  developerLogoUrl: string;
  propertyTypes: PropertyType[];
  facilities: { name: string; icon: React.ComponentType }[];
  nearbyLocations: { name: string; icon: React.ComponentType }[];
  mapCoordinates: [number, number];
}

// --- Data Dummy ---
const MOCK_HOUSING_DETAILS: HousingDetails = {
  developerId: "summarecon",
  clusterId: "suvarna-sutera",
  name: "Suvarna Sutera",
  mainImageUrl:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  description:
    "Sejak 2007, Tangerang mulai dikembangkan untuk Downtown basket dan menara di atas Downtown Lake...",
  priceRange: "819 JT - 2.1 M",
  installment: "8.1 JT",
  developer: "Summarecon Tangerang",
  subLocation: "Curug, Tangerang",
  location: "Downtown, Tangerang",
  developerLogoUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Summarecon_Agung.svg/1200px-Summarecon_Agung.svg.png",
  propertyTypes: [
    {
      id: "tipe-a",
      name: "Suvarna Sutera - Tipe A",
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
      price: "819 JT",
      installment: "8.1jt",
      bedrooms: 2,
      buildingArea: 58,
    },
    {
      id: "tipe-b",
      name: "Suvarna Sutera - Tipe B",
      imageUrl:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
      price: "1.4 M",
      installment: "8.1jt",
      bedrooms: 3,
      buildingArea: 80,
    },
    {
      id: "tipe-c",
      name: "Suvarna Sutera - Tipe C",
      imageUrl:
        "https://images.unsplash.com/photo-1600566753190-17f0e2723225?w=600",
      price: "2.1 M",
      installment: "8.1jt",
      bedrooms: 3,
      buildingArea: 110,
    },
  ],
  facilities: [
    { name: "Masjid", icon: MasjidIcon },
    { name: "Ruang Komunitas", icon: CommunityIcon },
    { name: "Taman", icon: ParkIcon },
    { name: "Gym", icon: GymIcon },
  ],
  nearbyLocations: [
    { name: "SMA N 1 Jakarta", icon: LocationPinIcon },
    { name: "Central Park Mall", icon: LocationPinIcon },
  ],
  mapCoordinates: [-6.2024, 106.6527],
};

// --- Komponen-komponen ---

const PropertyTypeCard: React.FC<{
  property: PropertyType;
  developerId: string;
  clusterId: string;
}> = ({ property, developerId, clusterId }) => (
  <Link
    href={`/developers/${developerId}/clusters/${clusterId}/properties/${property.id}`}
    className="block bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
  >
    <div className="relative w-full h-50">
      <Image
        src={property.imageUrl}
        alt={property.name}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="p-4">
      <h4 className="font-bold text-gray-800">{property.name}</h4>
      <div className="flex justify-between items-end mt-3">
        <div>
          <p className="text-xs text-gray-500">Harga mulai dari</p>
          <p className="text-lg font-bold text-teal-600">Rp {property.price}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Angsuran</p>
          <p className="text-lg font-bold text-teal-600">
            Rp {property.installment}
            <span className="text-xs font-normal">/bln</span>
          </p>
        </div>
      </div>
      <div className="flex text-sm text-gray-600 mt-3 pt-3 border-t">
        <div className="flex items-center mr-4">
          <BedIcon />
          <span className="ml-2">KT: {property.bedrooms}</span>
        </div>
        <div className="flex items-center">
          <BuildingAreaIcon />
          <span className="ml-2">LB: {property.buildingArea}m²</span>
        </div>
      </div>
    </div>
  </Link>
);

// --- Komponen Utama Aplikasi ---
export default function HousingDetailPage() {
  const details = MOCK_HOUSING_DETAILS;

  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/(debtor)/developers/components/Map"), {
        ssr: false,
        loading: () => (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <p>Loading map...</p>
          </div>
        ),
      }),
    []
  );

  return (
    <div className="bg-light-tosca min-h-screen">
      <main className="container">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {details.name}
            </h1>
            <div className="relative w-full h-100 rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src={details.mainImageUrl}
                alt={details.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {details.description}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tipe Properti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {details.propertyTypes.map((prop) => (
                <PropertyTypeCard
                  key={prop.id}
                  property={prop}
                  developerId={details.developerId}
                  clusterId={details.clusterId}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Fasilitas Bersama
            </h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {details.facilities.map((facility) => (
                <div
                  key={facility.name}
                  className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"
                >
                  <facility.icon />
                  <span className="ml-2 font-medium text-gray-700">
                    {facility.name}
                  </span>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Lokasi dan Tempat Sekitar
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-96">
                <Map
                  center={details.mapCoordinates}
                  popupText={`Lokasi ${details.name}`}
                />
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                {details.nearbyLocations.map((loc, index) => (
                  <div key={index} className="flex items-center">
                    <LocationPinIcon />
                    <span className="ml-3 text-gray-700">{loc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan (Sticky) - UPDATED */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                <div className="p-6">
                  <p className="text-sm text-teal-700">Harga mulai dari</p>
                  <p className="text-4xl font-bold text-gray-800 mt-1">
                    <span className="text-2xl align-top">Rp </span>
                    {details.priceRange}
                  </p>
                  <p className="text-teal-600 font-semibold mt-2">
                    Angsuran mulai dari Rp {details.installment}/bulan
                  </p>
                  <div className="my-5 border-t"></div>
                  <p className="text-xl font-bold text-gray-900">
                    {details.developer}
                  </p>
                  <p className="text-gray-500">{details.subLocation}</p>
                  <div className="my-5 border-t"></div>
                  <p className="text-sm text-gray-500 mb-2">Developer:</p>
                  <Image
                    src={details.developerLogoUrl}
                    alt="Developer Logo"
                    width={150}
                    height={50}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
