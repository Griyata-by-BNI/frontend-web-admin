"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { useSubmissionDetail, usePropertyDetail } from "@/services/kprService";
import { SUBMISSION_STEPS } from "@/utils/constants";
import { StatusTracker } from "../../in-process/[id]/components/StatusTracker";
import { PengajuanKPRView } from "../../in-process/[id]/components/PengajuanKPRView";
import { VerifikasiView } from "../../in-process/[id]/components/VerifikasiView";
import { HasilPengajuanView } from "./components/HasilPengajuanView";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function CompletedPageContent() {
  const params = useParams();
  const id = Number(params.id);

  const {
    data: submission,
    isLoading: submissionLoading,
    error: submissionError,
  } = useSubmissionDetail(id);
  const { data: property, isLoading: propertyLoading } = usePropertyDetail(
    submission?.loan_information?.property_id
  );

  const isLoading = submissionLoading || propertyLoading;
  const status =
    submission?.submission.status === "verified" ? "selesai" : "dalam_proses";
  const currentProgress = SUBMISSION_STEPS.HASIL;
  const [viewedStep, setViewedStep] = useState<number>(currentProgress);

  if (isNaN(id)) {
    return (
      <div className="text-center p-10 text-red-500">
        ID pengajuan tidak valid
      </div>
    );
  }

  if (isLoading) return <div className="text-center p-10">Memuat...</div>;

  if (submissionError || !submission) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 mb-2">Gagal memuat data pengajuan</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const stepsData = [
    {
      title: "Pengajuan KPR",
      date: new Date(submission.submission.submitted_at).toLocaleDateString(
        "id-ID"
      ),
    },
    {
      title: "Verifikasi Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString(
            "id-ID"
          )
        : "",
    },
    {
      title: "Hasil Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString(
            "id-ID"
          )
        : "",
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
                status === "selesai"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {status === "selesai" ? "Selesai" : "Dalam Proses"}
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
          {viewedStep === SUBMISSION_STEPS.PENGAJUAN && (
            <PengajuanKPRView
              submissionData={submission}
              propertyData={property ?? null}
            />
          )}
          {viewedStep === SUBMISSION_STEPS.VERIFIKASI && (
            <VerifikasiView submissionData={submission} />
          )}
          {viewedStep === SUBMISSION_STEPS.HASIL && (
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
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <CompletedPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
