"use client";

import { KPRSimulator } from "@/app/(debtor)/kpr-simulator";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useMemo } from "react";

// 1. Import Font Awesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faShower,
  faHouse,
  faChartArea,
  faLocationDot, // Added for the location pin
} from "@fortawesome/free-solid-svg-icons";

// --- Ikon SVG components have been removed ---

// --- Definisi Tipe Data (Updated for Font Awesome) ---
interface PropertyDetails {
  name: string;
  mainImageUrl: string;
  price: number;
  stock: number;
  installment: number;
  developer: string;
  subLocation: string;
  developerLogoUrl: string;
  description: string;
  // The 'icon' type is now any, as it holds an IconDefinition object from Font Awesome
  specifications: { text: string; icon: any }[];
  mapCoordinates: [number, number];
  nearbyLocations: { name: string }[]; // Icon is no longer needed here
}

// --- Data Dummy (Updated with Font Awesome icons) ---
const MOCK_PROPERTY_DETAILS: PropertyDetails = {
  name: "Suvarna Sutera - Tipe A",
  mainImageUrl:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  price: 819000000,
  stock: 10,
  installment: 8100000,
  developer: "Summarecon Tangerang",
  subLocation: "Curug, Tangerang",
  developerLogoUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Summarecon_Agung.svg/1200px-Summarecon_Agung.svg.png",
  description:
    "Tipe Asteria di Suvarna Sutera adalah hunian modern dua lantai yang dirancang untuk memaksimalkan kenyamanan dan fungsi...",
  // 2. Use the imported Font Awesome icon objects
  specifications: [
    { text: "4 Kamar Tidur", icon: faBed },
    { text: "3 Kamar Mandi", icon: faShower },
    { text: "Luas Tanah 135 m²", icon: faChartArea },
    { text: "Luas Bangunan 142 m²", icon: faHouse },
  ],
  mapCoordinates: [-6.2024, 106.6527],
  nearbyLocations: [
    { name: "SMA N 1 Jakarta" },
    { name: "SPM N 1 Jakarta" },
    { name: "Central Park Mall" },
    { name: "Central Park Mall" },
  ],
};

// --- Komponen Utama Aplikasi ---
export default function PropertyDetailPage() {
  const details = MOCK_PROPERTY_DETAILS;
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
    <div className="bg-light-tosca min-h-screen font-sans">
      <main className="container">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {details.name}
            </h1>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src={details.mainImageUrl}
                alt={details.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {details.description}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Spesifikasi
            </h2>
            <div className="bg-white/70 border-2 border-teal-200 rounded-2xl p-6 mb-8 shadow-sm backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {details.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center">
                    {/* 3. Render using the FontAwesomeIcon component */}
                    <FontAwesomeIcon
                      icon={spec.icon}
                      className="text-teal-600 w-6 h-6"
                    />
                    <span className="ml-4 text-gray-800 font-medium">
                      {spec.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Simulasi KPR
            </h2>
            <div className="mb-8">
              <KPRSimulator initialPropertyPrice={details.price} />
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
                    {/* 4. Use FontAwesomeIcon for the location pin */}
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-teal-600"
                    />
                    <span className="ml-3 text-gray-700">{loc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
                <div className="p-6">
                  <p className="text-sm text-teal-700">Harga mulai dari</p>
                  <p className="text-4xl font-bold text-gray-800 mt-1">
                    <span className="text-2xl align-top">Rp </span>
                    {new Intl.NumberFormat("id-ID").format(details.price)}
                  </p>
                  <p className="text-teal-600 font-semibold mt-2">
                    Angsuran mulai dari Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(details.installment)}
                    /bulan
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
              <div className="px-6 py-4">
                <button className="w-full bg-teal-500 text-white font-bold py-3 rounded-full mt-2 hover:bg-teal-600 transition-colors text-lg shadow-md">
                  Ajukan KPR
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}