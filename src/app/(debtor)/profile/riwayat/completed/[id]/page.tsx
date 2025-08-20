"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StatusTracker } from "../../in-process/[id]/components/StatusTracker";
import { PengajuanKPRView } from "../../in-process/[id]/components/PengajuanKPRView";
import { VerifikasiView } from "../../in-process/[id]/components/VerifikasiView";
import { HasilPengajuanView } from "./components/HasilPengajuanView";
import { getSubmissionById } from "@/services/kprService";
import { SubmissionDetail } from "@/types/riwayat";

function CompletedPageContent() {
  const params = useParams();
  const id = Number(params.id);

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await getSubmissionById(id);
          setSubmission(data);
        } catch (error) {
          console.error("Failed to fetch submission detail:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchSubmission();
  }, [id]);

  if (isLoading) return <div className="text-center p-10">Memuat...</div>;
  if (!submission) return <div className="text-center p-10">Data tidak ditemukan</div>;

  const status = submission.submission.status === "verified" || submission.submission.status === "completed" ? "disetujui" : "ditolak";
  const currentProgress = 3;
  const [viewedStep, setViewedStep] = useState(currentProgress);

  const stepsData = [
    { 
      title: "Pengajuan KPR", 
      date: new Date(submission.submission.submitted_at).toLocaleDateString("id-ID")
    },
    { 
      title: "Verifikasi Pengajuan", 
      date: submission.submission.verified_at 
        ? new Date(submission.submission.verified_at).toLocaleDateString("id-ID")
        : ""
    },
    { 
      title: "Hasil Pengajuan", 
      date: submission.submission.verified_at 
        ? new Date(submission.submission.verified_at).toLocaleDateString("id-ID")
        : ""
    },
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
          {viewedStep === 1 && <PengajuanKPRView submissionData={submission} />}
          {viewedStep === 2 && <VerifikasiView submissionData={submission} />}
          {viewedStep === 3 && (
            <HasilPengajuanView 
              status={status} 
              submissionId={submission.submission.id}
              verificationNotes={submission.submission.verification_notes}
            />
          )}
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