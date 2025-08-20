import Link from "next/link";
import { SubmissionSummary, ApiStatus } from "@/types/riwayat";
import StatusBadge from "./StatusBadge";

interface PengajuanCardProps {
  submission: SubmissionSummary;
}

const getLinkHref = (id: number, status: ApiStatus): string => {
  if (status === "submitted" || status === "under_review") {
    return `/profile/riwayat/in-process/${id}`;
  }
  return `/profile/riwayat/completed/${id}`;
};

export default function PengajuanCard({ submission }: PengajuanCardProps) {
  const href = getLinkHref(submission.id, submission.status);

  return (
    <Link href={href} className="cursor-pointer">
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <img
          src={submission.image_url}
          alt={submission.property_name}
          className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <h3 className="text-base font-medium text-gray-900 mb-1">
            {submission.property_name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {submission.developer_group}
          </p>
          <p className="text-sm text-gray-700">
            🗓️{" "}
            {new Date(submission.submitted_at).toLocaleDateString("id-ID")}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>
    </Link>
  );
}