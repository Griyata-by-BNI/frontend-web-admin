"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Developer, Cluster, MOCK_DEVELOPERS, HomeType } from '@/app/(debtor)/developers/types/developers'; // Impor dari file data Anda

// --- Ikon SVG ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18M3 10h12M3 16h6"/></svg>;
const LocationPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M2 4v16h20V4Z"/><path d="M2 10h20"/></svg>;
const BathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0L2 6"/><path d="m2 16 6 6"/><path d="M22 16 16 22"/><path d="M17 11h.01"/><path d="M15 13h.01"/><path d="M13 15h.01"/><path d="M22 8 12 18"/><path d="M15 3 5 13"/><path d="M22 8a6 6 0 0 0-8.49-8.49"/></svg>;
const LandAreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M21.2,12.3H20V9.8c0-1.1-0.9-2-2-2h-2.5V5.8c0-1.1-0.9-2-2-2h-5c-1.1,0-2,0.9-2,2v2H3.8c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2v-2.5h1.2c0.7,0,1.2-0.5,1.2-1.2V13.5C22.5,12.8,21.9,12.3,21.2,12.3z M18.8,20H3.8c-0.6,0-1-0.4-1-1v-9.2c0-0.6,0.4-1,1-1h15c0.6,0,1,0.4,1,1V20z"/><path d="M11.5,15.3h-5c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h5c0.3,0,0.5,0.2,0.5,0.5v5C12,15.1,11.8,15.3,11.5,15.3z"/></svg>;
const BuildingAreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>;


// --- Komponen-komponen ---

const HeroSearchBar: React.FC<{
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    isLocationEnabled: boolean;
}> = ({ searchTerm, setSearchTerm, sortOption, setSortOption, isLocationEnabled }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-cyan-500 transition-shadow">
                    <div className="pl-4 text-gray-400 pointer-events-none"><SearchIcon /></div>
                    <input 
                        type="text" 
                        placeholder="Cari cluster, developer, tipe rumah, atau lokasi..." 
                        className="w-full pr-4 py-3 pl-2 border-none focus:outline-none bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><SortIcon /></div>
                    <select 
                        className="w-full md:w-48 appearance-none pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="terbaru">Urutkan: Terbaru</option>
                        <option value="harga-tertinggi">Harga Tertinggi</option>
                        <option value="harga-terendah">Harga Terendah</option>
                        <option value="jarak-terdekat" disabled={!isLocationEnabled}>Jarak Terdekat</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const ClusterCard: React.FC<{ cluster: Cluster & { developerName: string } }> = ({ cluster }) => {
    const getTimeAgo = (dateUploaded: string) => {
        const now = new Date();
        const uploadedDate = new Date(dateUploaded);
        const diffInMonths = (now.getFullYear() - uploadedDate.getFullYear()) * 12 + (now.getMonth() - uploadedDate.getMonth());
        return `${diffInMonths} Bulan Lalu`;
    };
    const exampleHomeType = cluster.homeType[0];
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="relative w-full h-56">
                <Image src={cluster.imageUrl} alt={cluster.name} layout="fill" objectFit="cover" />
            </div>
            <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-teal-700">
                        <LocationPinIcon />
                        <span className="ml-1">{cluster.location}</span>
                    </div>
                    <div className="text-xs bg-teal-500 text-white font-semibold px-3 py-1 rounded-full">
                        {getTimeAgo(cluster.dateUploaded)}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{exampleHomeType.name} - Tipe {exampleHomeType.type}</h3>
                <p className="text-sm text-gray-500">{cluster.developerName}</p>
                <div className="my-4 flex items-center border-y py-3">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Harga</p>
                        <p className="text-xl font-bold text-gray-800">Rp {exampleHomeType.price}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200 mx-4"></div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Angsuran</p>
                        <p className="text-xl font-bold text-gray-800">Rp {exampleHomeType.installment} <span className="text-sm font-normal text-gray-500">/bulan</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2"><BedIcon /><span>KT: 3</span></div>
                    <div className="flex items-center gap-2"><BuildingAreaIcon /><span>LB: 117 m²</span></div>
                    <div className="flex items-center gap-2"><BathIcon /><span>KM: 3</span></div>
                    <div className="flex items-center gap-2"><LandAreaIcon /><span>LT: 135 m²</span></div>
                </div>
            </div>
        </div>
    );
};

// --- Komponen Utama Halaman ---
export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('terbaru');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const parsePrice = (priceStr: string): number => {
    const parts = priceStr.split(' ');
    const value = parseFloat(parts[0].replace(',', '.'));
    const multiplier = parts[1]?.toUpperCase() === 'M' ? 1000000 : 1;
    return value * multiplier;
  };

  const haversineDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const lat1 = toRad(coords1[0]);
    const lat2 = toRad(coords2[0]);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedAndFilteredClusters = useMemo(() => {
    const allClusters = MOCK_DEVELOPERS.flatMap(developer => 
      developer.clusters.map(cluster => ({
        ...cluster,
        developerName: developer.name
      }))
    );

    // UPDATED Filtering logic
    const filtered = allClusters.filter(cluster => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const matchesClusterName = cluster.name.toLowerCase().includes(lowercasedTerm);
        const matchesDeveloperName = cluster.developerName.toLowerCase().includes(lowercasedTerm);
        const matchesLocation = cluster.location.toLowerCase().includes(lowercasedTerm);
        // Cek apakah ada homeType yang cocok dengan pencarian
        const matchesHomeType = cluster.homeType.some(ht => 
            ht.name.toLowerCase().includes(lowercasedTerm) || 
            ht.type.toLowerCase().includes(lowercasedTerm)
        );
        return matchesClusterName || matchesDeveloperName || matchesLocation || matchesHomeType;
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'harga-tertinggi':
          return parsePrice(b.homeType[0].price) - parsePrice(a.homeType[0].price);
        case 'harga-terendah':
          return parsePrice(a.homeType[0].price) - parsePrice(b.homeType[0].price);
        case 'jarak-terdekat':
          if (!userLocation) return 0;
          const distA = haversineDistance(userLocation, a.coordinates);
          const distB = haversineDistance(userLocation, b.coordinates);
          return distA - distB;
        case 'terbaru':
        default:
          return new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
      }
    });
  }, [searchTerm, sortOption, userLocation]);

  return (
    <div className="bg-gray-50 font-sans">
      <section className="relative h-[50vh] flex items-center justify-center">
        <Image src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=600&fit=crop" alt="Cityscape background" layout="fill" objectFit="cover" className="z-0"/>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-6">Jelajahi Properti Impian Anda</h1>
            <HeroSearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                sortOption={sortOption}
                setSortOption={setSortOption}
                isLocationEnabled={!!userLocation}
            />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Menampilkan {sortedAndFilteredClusters.length} Cluster Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedAndFilteredClusters.length > 0 ? (
                    sortedAndFilteredClusters.map(cluster => (
                        <ClusterCard key={cluster.idCluster} cluster={cluster} />
                    ))
                ) : (
                    <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500">Tidak ada properti yang cocok dengan pencarian Anda.</p>
                )}
            </div>
        </section>
      </div>
    </div>
  );
}
