import { SubmissionSummary } from "@/types/riwayat";
import PengajuanCard from "./PengajuanCard";

interface SubmissionListProps {
  submissions: SubmissionSummary[];
}

export default function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Belum Ada Pengajuan
        </h3>
        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
          Saat ini tidak ada data pengajuan untuk ditampilkan. Pengajuan yang telah disubmit akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <PengajuanCard key={submission.submission?.id || Math.random()} submission={submission} />
      ))}
    </div>
  );
}