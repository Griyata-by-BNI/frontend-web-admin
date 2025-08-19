"use client";

import { useState, useEffect } from "react";
import { StatusTracker } from "./components/StatusTracker";
import { PengajuanKPRView } from "./components/PengajuanKPRView";
import { VerifikasiView } from "./components/VerifikasiView";
import { SubmissionDetail } from "../../types";
import { getSubmissionById } from "../../services/kprService";

export default function InProcessDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    getSubmissionById(params.id)
      .then(setSubmission)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading)
    return <div className="text-center p-10">Loading detail...</div>;
  if (!submission)
    return (
      <div className="text-center p-10">Data pengajuan tidak ditemukan.</div>
    );

  const currentProgress =
    submission.submission.status === "under_review" ? 2 : 1;
  const [viewedStep, setViewedStep] = useState(currentProgress);
  const stepsData = [
    {
      title: "Pengajuan KPR",
      date: new Date(submission.submission.createdAt).toLocaleDateString(
        "id-ID"
      ),
    },
    {
      title: "Verifikasi Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString(
            "id-ID"
          )
        : "...",
    },
    { title: "Hasil Pengajuan", date: "" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
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
