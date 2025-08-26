import Link from "next/link";
import { SubmissionSummary, ApiStatus } from "@/types/riwayat";
import { generateApplicationCode } from "@/utils/constants";
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
  const href = getLinkHref(
    submission.property_information.submissionId,
    submission.submission.status
  );
  const applicationCode = generateApplicationCode(
    submission.property_information.createdAt,
    submission.property_information.submissionId
  );

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all duration-300 group-hover:-translate-y-1">
        <div className="flex gap-6">
          {/* Property Image */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={
                  submission.property_information.propertyPhotoUrl[0] ||
                  "/placeholder-property.jpg"
                }
                alt={submission.property_information.propertyName}
                className="w-32 h-24 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">
                  {submission.property_information.propertyName}
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  {submission.property_information.developerName}
                </p>
              </div>
              <StatusBadge status={submission.submission.status} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>
                  {submission.property_information.clusterName} -{"  "}
                  {submission.property_information.clusterTypeName}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <span className="font-mono">{applicationCode}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {(() => {
                      const date = submission.property_information.createdAt 
                        ? new Date(submission.property_information.createdAt)
                        : new Date();
                      
                      return isNaN(date.getTime()) 
                        ? "Tanggal tidak valid"
                        : date.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });
                    })()} 
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="flex-shrink-0 flex items-center">
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
