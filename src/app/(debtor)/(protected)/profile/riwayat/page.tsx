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
  const {
    data: rejectedData = [],
    isLoading: loadingRejected,
    error: errorRejected,
  } = useSubmissionsByStatus("rejected");

  const inProcessSubmissions = useMemo(
    () => [...submittedData, ...underReviewData],
    [submittedData, underReviewData]
  );

  const completedSubmissions = useMemo(
    () => [...completedData, ...rejectedData],
    [completedData, rejectedData]
  );

  const isLoading = loadingSubmitted || loadingUnderReview || loadingCompleted || loadingRejected;
  const hasError = errorSubmitted || errorUnderReview || errorCompleted || errorRejected;

  const submissionsToDisplay =
    activeTab === "dalam-proses" ? inProcessSubmissions : completedSubmissions;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-t from-white to-light-tosca">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Riwayat Pengajuan KPR
            </h1>
            <p className="text-gray-600">
              Pantau status dan progres pengajuan KPR Anda
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-8">
            <div className="flex">
              <TabButton
                isActive={activeTab === "dalam-proses"}
                onClick={() => setActiveTab("dalam-proses")}
                count={inProcessSubmissions.length}
              >
                <div className="flex items-center gap-2">Dalam Proses</div>
              </TabButton>
              <TabButton
                isActive={activeTab === "selesai"}
                onClick={() => setActiveTab("selesai")}
                count={completedSubmissions.length}
              >
                <div className="flex items-center gap-2">Selesai</div>
              </TabButton>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Memuat data pengajuan...
                </p>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gagal Memuat Data
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  Terjadi kesalahan saat memuat data pengajuan
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <div className="p-6">
                <SubmissionList submissions={submissionsToDisplay} />
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
