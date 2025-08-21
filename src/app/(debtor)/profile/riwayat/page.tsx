"use client";

import { useState, useEffect } from "react";
import { SubmissionSummary, ApiStatus } from "@/types/riwayat";
import { getSubmissionsByUserId } from "@/services/kprService";
import { useAuth } from "@/contexts/authContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TabButton from "./components/TabButton";
import SubmissionList from "./components/SubmissionList";

export default function RiwayatPengajuanPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dalam-proses" | "selesai">("dalam-proses");
  const [inProcessSubmissions, setInProcessSubmissions] = useState<SubmissionSummary[]>([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<SubmissionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.userId) return;
      
      try {
        setIsLoading(true);
        const userId = parseInt(user.userId);
        
        // Fetch in-process submissions (submitted + under_review)
        const [submittedData, underReviewData] = await Promise.all([
          getSubmissionsByUserId(userId, "submitted"),
          getSubmissionsByUserId(userId, "under_review")
        ]);
        
        // Fetch completed submissions
        const completedData = await getSubmissionsByUserId(userId, "done");

        setInProcessSubmissions([...submittedData, ...underReviewData]);
        setCompletedSubmissions(completedData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  const submissionsToDisplay = activeTab === "dalam-proses" ? inProcessSubmissions : completedSubmissions;

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
        ) : (
          <SubmissionList submissions={submissionsToDisplay} />
        )}
      </div>
    </ProtectedRoute>
  );
}