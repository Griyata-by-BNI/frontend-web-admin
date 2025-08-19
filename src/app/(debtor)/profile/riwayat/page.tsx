"use client";

import { useState, useEffect } from "react";
import TabButton from "./components/TabButton";
import SubmissionList from "./components/SubmissionList";
import { SubmissionDetail } from "./types";
import { getAllSubmissions } from "./services/kprService";

export default function RiwayatPengajuanPage() {
  const [activeTab, setActiveTab] = useState<"dalam-proses" | "selesai">(
    "dalam-proses"
  );
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const statusesToFetch =
          activeTab === "dalam-proses"
            ? ["submitted", "under_review"]
            : ["verified", "rejected", "completed"];

        const data = await getAllSubmissions(statusesToFetch);
        data.sort(
          (a, b) =>
            new Date(b.submission.createdAt).getTime() -
            new Date(a.submission.createdAt).getTime()
        );
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [activeTab]);

  return (
    <div className="max-w-3xl mx-auto mt-[-16px] mb-[-16px] p-6 bg-gray-50 rounded-xl">
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
        <p className="text-center text-gray-500 py-8">Memuat data...</p>
      ) : (
        <SubmissionList submissions={submissions} />
      )}
    </div>
  );
}
