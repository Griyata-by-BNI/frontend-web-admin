"use client";

import DeveloperLogoMarquee from "./_components/DeveloperLogoMarquee";
import HeroSection from "./_components/HeroSection";
import KprToolsSection from "./_components/KprToolsSection";
import { LatestClusterSection } from "./_components/latestCluster";

export default function LandingPage() {
  return (
    <main className="space-y-10">
      <HeroSection />

      <LatestClusterSection />

      <DeveloperLogoMarquee />

      <KprToolsSection />
    </main>
  );
}
