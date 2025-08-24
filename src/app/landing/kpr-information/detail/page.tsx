"use client";

import interestRatesData from "@/data/list-interest.json";
import { RequirementsSection } from "./components/RequirementsSection";
import { InterestRateSection } from "./components/InterestRateSection";
import { CTASection } from "./components/CTASection";
import { InterestRatesData } from "../_types";

const DetailInfoKprPage = () => {
  return (
    <main className="max-w-5xl mx-auto px-5 mt-4 md:mt-10 mb-10">
      <RequirementsSection />

      <InterestRateSection data={interestRatesData as InterestRatesData} />

      <CTASection />
    </main>
  );
};

export default DetailInfoKprPage;
