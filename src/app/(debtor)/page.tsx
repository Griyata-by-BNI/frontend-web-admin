"use client";

import { FilterProvider } from "@/contexts/filterContext";
import DeveloperLogoMarquee from "./_components/DeveloperLogoMarquee";
import HeroSection from "./_components/HeroSection";
import KprToolsSection from "./_components/KprToolsSection";
import { LatestClusterSection } from "./_components/latestCluster";
import dynamic from "next/dynamic";

const ClustersMap = dynamic(() => import("./_components/ClustersMap"), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <main className="space-y-6 md:space-y-10 custom-container px-4 md:px-0 py-6">
      <FilterProvider>
        <HeroSection />
      </FilterProvider>

      <div className="mt-6 md:mt-10">
        <LatestClusterSection />
      </div>

      <DeveloperLogoMarquee />

      <KprToolsSection />

      <ClustersMap />
    </main>
  );
}
