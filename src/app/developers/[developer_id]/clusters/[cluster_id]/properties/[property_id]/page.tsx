"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import the KPRSimulator from its new location
import { KPRSimulator } from '@/components/kpr-simulator';

// --- Ikon SVG (Your SVG components remain the same) ---
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M2 4v16h20V4Z"/><path d="M2 10h20"/></svg>;
const BathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0L2 6"/><path d="m2 16 6 6"/><path d="M22 16 16 22"/><path d="M17 11h.01"/><path d="M15 13h.01"/><path d="M13 15h.01"/><path d="M22 8 12 18"/><path d="M15 3 5 13"/><path d="M22 8a6 6 0 0 0-8.49-8.49"/></svg>;
const LandAreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M21.2,12.3H20V9.8c0-1.1-0.9-2-2-2h-2.5V5.8c0-1.1-0.9-2-2-2h-5c-1.1,0-2,0.9-2,2v2H3.8c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2v-2.5h1.2c0.7,0,1.2-0.5,1.2-1.2V13.5C22.5,12.8,21.9,12.3,21.2,12.3z M18.8,20H3.8c-0.6,0-1-0.4-1-1v-9.2c0-0.6,0.4-1,1-1h15c0.6,0,1,0.4,1,1V20z"/><path d="M11.5,15.3h-5c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h5c0.3,0,0.5,0.2,0.5,0.5v5C12,15.1,11.8,15.3,11.5,15.3z"/></svg>;
const BuildingAreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>;
const LocationPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

// --- Definisi Tipe Data ---
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
  specifications: { text: string; icon: React.ComponentType; }[];
  mapCoordinates: [number, number];
  nearbyLocations: { name: string; icon: React.ComponentType; }[];
}

// --- Data Dummy ---
const MOCK_PROPERTY_DETAILS: PropertyDetails = {
  name: 'Suvarna Sutera - Tipe A',
  mainImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  price: 819000000,
  stock: 10,
  installment: 8100000,
  developer: 'Summarecon Tangerang',
  subLocation: 'Curug, Tangerang',
  developerLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Summarecon_Agung.svg/1200px-Summarecon_Agung.svg.png',
  description: 'Tipe Asteria di Suvarna Sutera adalah hunian modern dua lantai yang dirancang untuk memaksimalkan kenyamanan dan fungsi...',
  specifications: [
    { text: '4 Kamar Tidur', icon: BedIcon }, { text: '4 Kamar Tidur', icon: BedIcon },
    { text: '3 Kamar Mandi', icon: BathIcon }, { text: '3 Kamar Mandi', icon: BathIcon },
    { text: 'Luas Tanah 135 m²', icon: LandAreaIcon }, { text: 'Luas Tanah 135 m²', icon: LandAreaIcon },
    { text: 'Luas Bangunan 142 m²', icon: BuildingAreaIcon }, { text: 'Luas Bangunan 142 m²', icon: BuildingAreaIcon },
  ],
  mapCoordinates: [-6.2024, 106.6527],
  nearbyLocations: [
    { name: 'SMA N 1 Jakarta', icon: LocationPinIcon }, { name: 'SPM N 1 Jakarta', icon: LocationPinIcon },
    { name: 'Central Park Mall', icon: LocationPinIcon }, { name: 'Central Park Mall', icon: LocationPinIcon },
  ],
};


// --- Komponen Utama Aplikasi ---
export default function PropertyDetailPage() {
  const details = MOCK_PROPERTY_DETAILS;
  const Map = useMemo(() => dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-gray-200"><p>Loading map...</p></div> }), []);

  return (
    <div className="bg-light-tosca min-h-screen font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{details.name}</h1>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image src={details.mainImageUrl} alt={details.name} layout="fill" objectFit="cover" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{details.description}</p>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Spesifikasi</h2>
            <div className="bg-white/70 border-2 border-teal-200 rounded-2xl p-6 mb-8 shadow-sm backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {details.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center">
                    <spec.icon />
                    <span className="ml-4 text-gray-800 font-medium">{spec.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Simulasi KPR</h2>
            <div className="mb-8">
                <KPRSimulator initialPropertyPrice={details.price} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi dan Tempat Sekitar</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-96"><Map center={details.mapCoordinates} popupText={`Lokasi ${details.name}`} /></div>
              <div className="p-6 grid grid-cols-2 gap-4">
                {details.nearbyLocations.map((loc, index) => (
                  <div key={index} className="flex items-center"><LocationPinIcon /><span className="ml-3 text-gray-700">{loc.name}</span></div>
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
                    {new Intl.NumberFormat('id-ID').format(details.price)}
                  </p>
                  <p className="text-teal-600 font-semibold mt-2">
                    Angsuran mulai dari Rp {new Intl.NumberFormat('id-ID').format(details.installment)}/bulan
                  </p>
                  <div className="my-5 border-t"></div>
                  <p className="text-xl font-bold text-gray-900">{details.developer}</p>
                  <p className="text-gray-500">{details.subLocation}</p>
                  <div className="my-5 border-t"></div>
                  <p className="text-sm text-gray-500 mb-2">Developer:</p>
                  <Image src={details.developerLogoUrl} alt="Developer Logo" width={150} height={50} style={{ objectFit: 'contain' }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <button className="w-full bg-white text-teal-600 border-2 border-teal-500 font-bold py-1 rounded-full mt-2 hover:bg-teal-50 transition-colors text-lg shadow-md">
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