"use client";

import { FilterProvider } from "@/contexts/filterContext";
import SearchBar from "./_components/SearchBar";
import ExploreResults from "./_components/ExploreResults";
import KprToolsSection from "../_components/KprToolsSection";

export default function SearchPage() {
  return (
    <FilterProvider>
      <main className="flex flex-col gap-8 custom-container">
        <SearchBar />

        <ExploreResults />

        <KprToolsSection className="bg-primary-tosca/20" />
      </main>
    </FilterProvider>
  );
}
