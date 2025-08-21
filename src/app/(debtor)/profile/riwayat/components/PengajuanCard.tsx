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

const generateApplicationCode = (submittedAt: string, submissionId: number): string => {
  const date = new Date(submittedAt);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `${dateStr}${submissionId.toString().padStart(3, '0')}`;
};

export default function PengajuanCard({ submission }: PengajuanCardProps) {
  const href = getLinkHref(submission.submission.id, submission.submission.status);
  const applicationCode = generateApplicationCode(
    submission.submission.submitted_at, 
    submission.submission.id
  );

  return (
    <Link href={href} className="cursor-pointer">
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <img
          src={submission.property_information.propertyPhotoUrl[0] || "/placeholder-property.jpg"}
          alt={submission.property_information.propertyName}
          className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <h3 className="text-base font-medium text-gray-900 mb-1">
            {submission.property_information.propertyName}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {submission.property_information.developerName}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            {submission.property_information.clusterName} - {submission.property_information.clusterTypeName}
          </p>
          <p className="text-xs text-gray-500">
            Kode: {applicationCode}
          </p>
          <p className="text-sm text-gray-700">
            🗓️ {new Date(submission.submission.submitted_at).toLocaleDateString("id-ID")}
          </p>
        </div>
        <StatusBadge status={submission.submission.status} />
      </div>
    </Link>
  );
}