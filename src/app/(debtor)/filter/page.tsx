"use client";

import { useState } from "react";
import FilterPopup from "./components/FilterPopup";

export default function YourPage() {
  const [isFilterOpen, setFilterOpen] = useState(false);

  const handleApplyFilter = (filters: any) => {
    console.log("Filter baru dari user:", filters);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Landing Page (Akan di-integrate dengan Landing Page)
      </h1>
      <p>Ini adalah konten halaman yang akan menjadi blur.</p>

      <button
        onClick={() => setFilterOpen(true)}
        className="mt-4 px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
      >
        Tampilkan Filter
      </button>

      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilter}
      />
    </main>
  );
}
