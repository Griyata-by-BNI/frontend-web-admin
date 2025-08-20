"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SubmissionDetail } from "@/types/riwayat";
import { getSubmissionById } from "@/services/kprService";
import { StatusTracker } from "./components/StatusTracker";
import { PengajuanKPRView } from "./components/PengajuanKPRView";
import { VerifikasiView } from "./components/VerifikasiView";

export default function InProcessDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentProgress = submission?.submission.status === "under_review" ? 2 : 1;
  const [viewedStep, setViewedStep] = useState(currentProgress);

  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await getSubmissionById(id);
          setSubmission(data);
          if (data) {
            const progress = data.submission.status === "under_review" ? 2 : 1;
            setViewedStep(progress);
          }
        } catch (error) {
          console.error("Failed to fetch submission detail:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <div className="text-center p-10">Memuat detail pengajuan...</div>;
  }

  if (!submission) {
    return (
      <div className="text-center p-10">Data pengajuan tidak ditemukan.</div>
    );
  }

  const stepsData = [
    { 
      title: "Pengajuan KPR", 
      date: new Date(submission.submission.submitted_at).toLocaleDateString("id-ID")
    },
    {
      title: "Verifikasi Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString("id-ID")
        : "",
    },
    { title: "Hasil Pengajuan", date: "" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Detail Pengajuan</h1>
        </header>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <StatusTracker
            steps={stepsData}
            currentProgress={currentProgress}
            viewedStep={viewedStep}
            onStepClick={setViewedStep}
          />
        </div>

        <main className="mt-8">
          {viewedStep === 1 && <PengajuanKPRView submissionData={submission} />}
          {viewedStep === 2 && <VerifikasiView submissionData={submission} />}
        </main>
      </div>
    </div>
  );
}