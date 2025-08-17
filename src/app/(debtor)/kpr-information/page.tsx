"use client";

import React from "react";
import { BniGriyaSection } from "./_components/BniGriyaSection";
import { KeunggulanSection } from "./_components/KeunggulanSection";
import { JenisFiturSection } from "./_components/JenisFiturSection";
import { FaqSection } from "./_components/FaqSection";
import { ContactSection } from "./_components/ContactSection";
import { faqData, jenisFitur } from "./_constants";

const InfoKprPage: React.FC = () => {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto max-w-3xl p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Informasi KPR
        </h1>

        <BniGriyaSection />

        <KeunggulanSection />

        <JenisFiturSection items={jenisFitur} />

        <FaqSection faqData={faqData} />

        <ContactSection />
      </div>
    </div>
  );
};

export default InfoKprPage;
