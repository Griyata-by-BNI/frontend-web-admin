"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import FilterPopup, { FilterState } from './components/FilterPopup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faShower, faHouse, faChartArea } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from '@/lib/axios'; 

// --- DEFINISI TIPE ---
interface Facility {
    name: 'KT' | 'KM' | 'LB' | 'LT';
    value: number;
}
interface Property {
    id: number;
    location: string; 
    propertyName: string;
    developerName: string;
    price: number;
    // 'installment' tidak lagi wajib ada di data API
    installment?: number; 
    facilities: Facility[];
    updatedAt: string;
    photoUrl: string | null;
}

// --- IKON SVG ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18M3 10h12M3 16h6"/></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const LocationPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

const HeroSearchBar: React.FC<{
    searchTerm: string; setSearchTerm: (term: string) => void; sortOption: string; setSortOption: (option: string) => void; onFilterClick: () => void;
}> = ({ searchTerm, setSearchTerm, sortOption, setSortOption, onFilterClick }) => (
    <div className="bg-white p-4 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-cyan-500 transition-shadow">
                <div className="pl-4 text-gray-400 pointer-events-none"><SearchIcon /></div>
                <input type="text" placeholder="Cari nama properti, developer, lokasi..." className="w-full pr-4 py-3 pl-2 border-none focus:outline-none bg-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="w-full md:w-auto flex-shrink-0 flex gap-4">
                 <div className="relative w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><SortIcon /></div>
                    <select className="w-full md:w-48 appearance-none pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="updatedAt">Urutkan: Terbaru</option>
                        <option value="highestPrice">Harga Tertinggi</option>
                        <option value="lowestPrice">Harga Terendah</option>
                    </select>
                </div>
                <button onClick={onFilterClick} className="w-full md:w-auto px-4 py-3 flex items-center justify-center gap-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                    <FilterIcon />
                    <span>Filter</span>
                </button>
            </div>
        </div>
    </div>
);

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const getFacilityValue = (name: Facility['name']): number | string => property.facilities.find(f => f.name === name)?.value ?? 'N/A';
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
        if (amount >= 1000000) return `Rp ${(amount / 1000000).toLocaleString('id-ID')} JT`;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };
    const formatInstallment = (amount: number) => {
        if (amount >= 1000000) return `Rp ${(amount / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };
    const getTimeAgo = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        let interval = seconds / 31536000; if (interval > 1) return `${Math.floor(interval)} tahun lalu`;
        interval = seconds / 2592000; if (interval > 1) return `${Math.floor(interval)} bulan lalu`;
        interval = seconds / 86400; if (interval > 1) return `${Math.floor(interval)} hari lalu`;
        interval = seconds / 3600; if (interval > 1) return `${Math.floor(interval)} jam lalu`;
        interval = seconds / 60; if (interval > 1) return `${Math.floor(interval)} menit lalu`;
        return `beberapa detik lalu`;
    };

    // --- FUNGSI BARU UNTUK MENGHITUNG ANGSURAN ---
    const calculateInstallment = (price: number): number => {
        const interestRate = 3.25 / 100 / 12; // Bunga per bulan
        const tenorInMonths = 3 * 12;

        // Rumus cicilan KPR (Anuitas)
        const principal = price;
        if (principal === 0 || interestRate === 0) return 0;
        
        const monthlyPayment = principal * interestRate / (1 - Math.pow(1 + interestRate, -tenorInMonths));
        return monthlyPayment;
    };

    const monthlyInstallment = calculateInstallment(property.price);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="relative w-full h-56 bg-gray-200"><Image src={property.photoUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"} alt={property.propertyName} layout="fill" objectFit="cover" /></div>
            <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-teal-700"><LocationPinIcon /><span className="ml-1">{property.location}</span></div>
                    <div className="text-xs bg-teal-500 text-white font-semibold px-3 py-1 rounded-full">{getTimeAgo(property.updatedAt)}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 truncate" title={property.propertyName}>{property.propertyName}</h3>
                <p className="text-sm text-gray-500">{property.developerName}</p>
                <div className="my-4 flex items-center py-3">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Harga</p>
                        <p className="text-xl font-bold text-gray-800">{formatCurrency(property.price ?? 0)}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200 mx-4"></div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Angsuran</p>
                        <p className="text-xl font-bold text-gray-800">
                            {/* Menggunakan hasil perhitungan dinamis */}
                            {formatInstallment(monthlyInstallment)}
                            <span className="text-sm font-normal text-gray-500"> /bulan</span>
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faBed} className="w-4 text-gray-500" />
                      <span>KT: {getFacilityValue('KT')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faHouse} className="w-4 text-gray-500" />
                      <span>LB: {getFacilityValue('LB')} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faShower} className="w-4 text-gray-500" />
                      <span>KM: {getFacilityValue('KM')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartArea} className="w-4 text-gray-500" />
                      <span>LT: {getFacilityValue('LT')} m²</span>
                  </div>
              </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-5 animate-pulse">
        <div className="h-56 bg-gray-200 rounded-lg"></div><div className="mt-4 h-6 w-3/4 bg-gray-200 rounded"></div><div className="mt-2 h-4 w-1/2 bg-gray-200 rounded"></div><div className="my-4 border-y py-3 h-10"></div>
        <div className="grid grid-cols-2 gap-4 mt-2"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded"></div></div>
    </div>
);

// --- KOMPONEN HALAMAN UTAMA ---
export default function ExplorePage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('updatedAt');
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

    const fetchProperties = useCallback(async (
        currentSearchTerm: string, currentSortOption: string, currentFilters: FilterState | null
    ) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                search: currentSearchTerm, sortBy: currentSortOption, pageNumber: 1, pageSize: 10,
            };
            if (currentFilters) {
                if (currentFilters.price.min > 0) params.kisaranHargaMin = currentFilters.price.min;
                if (currentFilters.price.max < 15500000) params.kisaranHargaMax = currentFilters.price.max;
                if (currentFilters.bedrooms > 0) params.jumlahKamarTidur = currentFilters.bedrooms;
                if (currentFilters.bathrooms > 0) params.jumlahKamarMandi = currentFilters.bathrooms;
                if (currentFilters.floors > 0) params.jumlahLantai = currentFilters.floors;
                if (currentFilters.landArea.min > 0) params.luasTanahMin = currentFilters.landArea.min;
                if (currentFilters.landArea.max < 200) params.luasTanahMax = currentFilters.landArea.max;
                if (currentFilters.buildingArea.min > 0) params.luasBangunanMin = currentFilters.buildingArea.min;
                if (currentFilters.buildingArea.max < 180) params.luasBangunanMax = currentFilters.buildingArea.max;
            }
            const response = await axiosInstance.get(`/api/v1/properties/explore`, {
                params, headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            const result = response.data;
            if (result.data && Array.isArray(result.data.properties)) {
                setProperties(result.data.properties);
            } else { throw new Error("Struktur data dari API tidak sesuai"); }
        } catch (err: any) {
            console.error("Gagal mengambil data properti:", err);
            if (axios.isAxiosError(err)) setError(err.response?.data?.status?.message || "Gagal menghubungi server.");
            else setError(err.message || "Terjadi kesalahan.");
            setProperties([]);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => { fetchProperties(searchTerm, sortOption, appliedFilters); }, 500); 
        return () => clearTimeout(handler);
    }, [searchTerm, sortOption, appliedFilters, fetchProperties]);

    const handleApplyFilters = (filters: FilterState) => {
        setAppliedFilters(filters);
        setFilterOpen(false);
    };

    const renderContent = () => {
        if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>;
        if (error) return <div className="md:col-span-3 text-center py-10"><p className="text-red-600 font-semibold">{error}</p></div>;
        if (properties.length === 0) return <div className="md:col-span-3 text-center py-10"><p className="text-gray-500">Tidak ada properti yang cocok.</p></div>;
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{properties.map(property => <PropertyCard key={property.id} property={property} />)}</div>;
    };

    return (
        <div className="bg-gray-50 font-sans min-h-screen">
            <section className="relative h-[50vh] flex items-center justify-center bg-gray-700">
                <Image src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=600&fit=crop" alt="Cityscape background" layout="fill" objectFit="cover" className="z-0 opacity-50" priority/>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 w-full px-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-6">Jelajahi Properti Impian Anda</h1>
                    <HeroSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} onFilterClick={() => setFilterOpen(true)} />
                </div>
            </section>
            <main className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{loading ? 'Mencari...' : `Menampilkan ${properties.length} Properti`}</h2>
                {renderContent()}
            </main>
            <FilterPopup isOpen={isFilterOpen} onCloseAction={() => setFilterOpen(false)} onApplyAction={handleApplyFilters} />
        </div>
    );
}