"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { SUBMISSION_STEPS } from "@/utils/constants";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { StatusTracker } from "./components/StatusTracker";
import { PengajuanKPRView } from "./components/PengajuanKPRView";
import { VerifikasiView } from "./components/VerifikasiView";
import { usePropertyDetail, useSubmissionDetail } from "@/services/kprService";

export default function InProcessDetailPage() {
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

  const currentProgress = useMemo(
    () =>
      submission?.submission.status === "under_review"
        ? SUBMISSION_STEPS.VERIFIKASI
        : SUBMISSION_STEPS.PENGAJUAN,
    [submission?.submission.status]
  );

  const [viewedStep, setViewedStep] = useState(currentProgress);

  const isLoading = submissionLoading || propertyLoading;

  if (isNaN(id)) {
    return (
      <ProtectedRoute>
        <div className="text-center p-10 text-red-500">
          ID pengajuan tidak valid
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="text-center p-10">Memuat detail pengajuan...</div>
      </ProtectedRoute>
    );
  }

  if (submissionError || !submission) {
    return (
      <ProtectedRoute>
        <div className="text-center p-10">
          <p className="text-red-500 mb-2">Gagal memuat data pengajuan</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:underline"
          >
            Coba lagi
          </button>
        </div>
      </ProtectedRoute>
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
    { title: "Hasil Pengajuan", date: "" },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Detail Pengajuan
            </h1>
          </header>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <StatusTracker
              steps={stepsData}
              currentProgress={currentProgress}
              viewedStep={viewedStep}
              onStepClick={(step: number) =>
                setViewedStep(step as typeof currentProgress)
              }
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
