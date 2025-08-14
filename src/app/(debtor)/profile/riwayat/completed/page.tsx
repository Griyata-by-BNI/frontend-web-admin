"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { StatusTracker } from "../in-process/components/StatusTracker";
import { PengajuanKPRView } from "../in-process/components/PengajuanKPRView";
import { VerifikasiView } from "../in-process/components/VerifikasiView";
import { HasilPengajuanView } from "./components/HasilPengajuanView";

function CompletedPageContent() {
  const searchParams = useSearchParams();
  const status =
    (searchParams.get("status") as "disetujui" | "ditolak") || "disetujui";

  const currentProgress = 3;
  const [viewedStep, setViewedStep] = useState(currentProgress);

  const stepsData = [
    { title: "Pengajuan KPR", date: "01/08/2025" },
    { title: "Verifikasi Pengajuan", date: "05/08/2025" },
    { title: "Hasil Pengajuan", date: "12/08/2025" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Detail Pengajuan</h1>
        </header>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-700">
              Status Pengajuan
            </h2>
            <span
              className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                status === "disetujui"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status === "disetujui" ? "Disetujui" : "Ditolak"}
            </span>
          </div>

          <StatusTracker
            steps={stepsData}
            currentProgress={currentProgress}
            viewedStep={viewedStep}
            onStepClick={setViewedStep}
          />
        </div>

        <main className="mt-8">
          {viewedStep === 1 && <PengajuanKPRView />}
          {viewedStep === 2 && <VerifikasiView />}
          {viewedStep === 3 && <HasilPengajuanView status={status} />}
        </main>
      </div>
    </div>
  );
}

export default function CompletedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompletedPageContent />
    </Suspense>
  );
}
