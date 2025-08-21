"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

export default function HeroSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      // Navigate to the explore page with the search term as a query parameter
      router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative mt-6 max-w-lg mx-auto">
      <input 
        type="text" 
        placeholder="Cari lokasi properti / developer" 
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon />
      </div>
    </div>
  );
}