"use client";

import { useState, useMemo } from "react";
import { useSubmissionsByStatus } from "@/services/kprService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TabButton from "./components/TabButton";
import SubmissionList from "./components/SubmissionList";

export default function RiwayatPengajuanPage() {
  const [activeTab, setActiveTab] = useState<"dalam-proses" | "selesai">(
    "dalam-proses"
  );

  const {
    data: submittedData = [],
    isLoading: loadingSubmitted,
    error: errorSubmitted,
  } = useSubmissionsByStatus("submitted");
  const {
    data: underReviewData = [],
    isLoading: loadingUnderReview,
    error: errorUnderReview,
  } = useSubmissionsByStatus("under_review");
  const {
    data: completedData = [],
    isLoading: loadingCompleted,
    error: errorCompleted,
  } = useSubmissionsByStatus("verified");

  const inProcessSubmissions = useMemo(
    () => [...submittedData, ...underReviewData],
    [submittedData, underReviewData]
  );

  const isLoading = loadingSubmitted || loadingUnderReview || loadingCompleted;
  const hasError = errorSubmitted || errorUnderReview || errorCompleted;

  const submissionsToDisplay =
    activeTab === "dalam-proses" ? inProcessSubmissions : completedData;

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Riwayat Pengajuan
        </h2>
        <div className="flex bg-gray-200 rounded-xl p-1 mb-6">
          <TabButton
            isActive={activeTab === "dalam-proses"}
            onClick={() => setActiveTab("dalam-proses")}
          >
            Dalam Proses
          </TabButton>
          <TabButton
            isActive={activeTab === "selesai"}
            onClick={() => setActiveTab("selesai")}
          >
            Selesai
          </TabButton>
        </div>

        {isLoading ? (
          <p className="text-center py-8">Memuat data...</p>
        ) : hasError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Gagal memuat data pengajuan</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:underline"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <SubmissionList submissions={submissionsToDisplay} />
        )}
      </div>
    </ProtectedRoute>
  );
}
