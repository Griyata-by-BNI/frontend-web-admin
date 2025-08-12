"use client"; 

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Developer } from '@/types/developer'; 
import PropertyCard from '@/components/PropertyCard'; 
import Pagination from '@/components/Pagination';


// --- Ikon SVG sebagai Komponen React ---
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const MOCK_DEVELOPER_DETAILS: Developer = {
  id: 'summarecon',
  name: 'Summarecon',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Summarecon_Agung.svg/1200px-Summarecon_Agung.svg.png',
  description: 'Sejak 2004, salah satu unit bisnis pengembang properti terkemuka di Indonesia, Summarecon, sukses mengembangkan kawasan hunian bersama Summarecon Serpong yang hingga kini telah berhasil mengembangkan perumahan maupun komersial di area seluas kurang lebih 320 hektar. Summarecon Serpong telah membangun sekitar lebih dari 12.000 unit rumah, 6.000 unit apartemen, 1.800 kavling perumahan, 2.000 unit ruko, pusat perbelanjaan Summarecon Mall Serpong, Pasar Modern Sinpasa.',
  properties: [
    { id: 'p1', name: 'Briza', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', price: '2.1 M', installment: '8.1jt' },
    { id: 'p2', name: 'Suvarna Sutera', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', price: '2.1 M', installment: '8.1jt' },
    { id: 'p3', name: 'Suvarna Sutera Premium', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', price: '2.1 M', installment: '8.1jt' },
  ]
};


export default function App() {
  const developer = MOCK_DEVELOPER_DETAILS;

  return (
    <div className="bg-[#f0fafa] min-h-screen font-sans">

      {/* Konten Utama */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Judul dan Breadcrumbs */}
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{developer.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-2 flex-wrap">
                <HomeIcon />
                <a href="#" className="ml-1 hover:underline">Partner Developer</a>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-800">{developer.name}</span>
            </div>
        </div>

        {/* Tentang Developer */}
        <section className="mt-8 bg-white p-8 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex justify-center items-center">
                    <Image src={developer.logoUrl} alt={`${developer.name} logo`} width={250} height={125} objectFit="contain" />
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang {developer.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{developer.description}</p>
                </div>
            </div>
        </section>

        {/* Jelajahi Properti */}
        <section className="mt-12">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Jelajahi Properti dari {developer.name}</h2>
                <div className="relative w-full sm:w-auto">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari Cluster"
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {developer.properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </section>

        {/* Pagination */}
        <Pagination />

      </main>
    </div>
  );
}
