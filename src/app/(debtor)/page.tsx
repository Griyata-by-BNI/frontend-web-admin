"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import PropertyCard from '@/app/(debtor)/developers/components/PropertyCard';
import { KPRSimulator } from '@/app/(debtor)/kpr-simulator/_components/KPRSimulator';
import { CTASection } from '@/app/(debtor)/kpr-information/detail/components/CTASection';
import Navbar from '@/components/navbar';

// --- Ikon SVG ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

// --- Definisi Tipe Data ---
interface Property {
  id: string;
  developerId: string;
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  installment: string;
}

// --- Data Dummy ---
const MOCK_PROPERTIES: Property[] = [
  { id: 'p1', developerId: 'summarecon', name: 'Suvarna Sutera', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', price: '2.1 M', installment: '8.1jt' },
  { id: 'p2', developerId: 'summarecon', name: 'Suvarna Sutera', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600', price: '2.1 M', installment: '8.1jt' },
  { id: 'p3', developerId: 'sinarmas-land', name: 'BSD City', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600', price: '2.1 M', installment: '8.1jt' },
  { id: 'p4', developerId: 'sinarmas-land', name: 'Grand Wisata', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', price: '2.1 M', installment: '8.1jt' },
];


// --- Komponen Utama Halaman ---
export default function HomePage() {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-100 to-white pt-20 pb-10 text-center relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Gunakan Cara Baru,
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-500 leading-tight mt-2">
            untuk Pindah ke Rumah Baru!
          </h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Bersama BNI, wujudkan KPR dengan sentuhan jari.
          </p>
          <div className="text-center mb-12">
                <div className="relative mt-6 max-w-lg mx-auto">
                  <input type="text" placeholder="Cari lokasi properti / developer" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                </div>
              </div>
          
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 opacity-20">

        </div>
      </section>

      {/* Main Content Section */}
       <div className="relative">
        <Image
          src="/home.png" // Pastikan nama file ini benar dan ada di folder /public
          alt="Content background shape"
          width={1920} // Fixed width
          height={150} // Fixed height for the shape
          className="w-full -mt-5" // Ensure it spans full width
        />
            <div className="container mx-auto px-4">


              {/* Cluster Terbaru */}
              <div className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Cluster Terbaru</h3>
                  <Link href="/explore" className="text-cyan-600 font-semibold hover:underline">Lihat Semua</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MOCK_PROPERTIES.map(prop => (
                    <PropertyCard 
                      key={prop.id} 
                      property={prop} 
                      developerId={prop.developerId}
                    />
                  ))}
                </div>
              </div>
            </div>
      </div>

      {/* Simulasi KPR Section */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">Simulasikan KPRmu!</h2>
            <p className="text-gray-500 mt-2">Transparansi Angsuran di Ujung Jari Anda</p>
            <div className="mt-8 max-w-5xl mx-auto">
              <KPRSimulator initialPropertyPrice={2400000000} />
            </div>
          </div>
        </div>
      </section>

      {/* Mulai Perencanaan Section */}
      <section className="bg-white py-16">
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="text-center">
            <CTASection/>
          </div>
        </div>
      </section>
    </div>
  );
}
