"use client";

import { useState, useEffect } from "react";
import { SubmissionSummary, ApiStatus } from "@/types/riwayat";
import { getAllSubmissions } from "@/services/kprService";
import TabButton from "./components/TabButton";
import SubmissionList from "./components/SubmissionList";

const isInProcess = (status: ApiStatus): boolean => {
  return status === "submitted" || status === "under_review";
};

const isCompleted = (status: ApiStatus): boolean => {
  return status === "verified" || status === "completed" || status === "rejected";
};

export default function RiwayatPengajuanPage() {
  const [activeTab, setActiveTab] = useState<"dalam-proses" | "selesai">(
    "dalam-proses"
  );
  const [inProcessSubmissions, setInProcessSubmissions] = useState<
    SubmissionSummary[]
  >([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<
    SubmissionSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const allSubmissions = await getAllSubmissions();

        const inProcess = allSubmissions.filter((s) => 
          isInProcess(s.status)
        );
        const completed = allSubmissions.filter((s) => 
          isCompleted(s.status)
        );

        setInProcessSubmissions(inProcess);
        setCompletedSubmissions(completed);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const submissionsToDisplay =
    activeTab === "dalam-proses" ? inProcessSubmissions : completedSubmissions;

  return (
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
      ) : (
        <SubmissionList submissions={submissionsToDisplay} />
      )}
    </div>
  );
}