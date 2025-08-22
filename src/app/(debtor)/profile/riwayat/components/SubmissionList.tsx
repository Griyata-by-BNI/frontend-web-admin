import { SubmissionSummary } from "@/types/riwayat";
import PengajuanCard from "./PengajuanCard";

interface SubmissionListProps {
  submissions: SubmissionSummary[];
}

export default function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Tidak Ada Pengajuan
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Saat ini tidak ada data untuk ditampilkan di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <PengajuanCard key={submission.submission?.id || Math.random()} submission={submission} />
      ))}
    </div>
  );
}