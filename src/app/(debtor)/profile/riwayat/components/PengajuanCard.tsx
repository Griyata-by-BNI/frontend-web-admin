import Link from "next/link";
import { SubmissionDetail } from "../types";
import StatusBadge from "./StatusBadge";

interface PengajuanCardProps {
  submission: SubmissionDetail;
}

export default function PengajuanCard({ submission }: PengajuanCardProps) {
  const {
    submission: sub,
    debtor_information,
    employee_information,
  } = submission;

  const imageUrl =
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop";
  const title = `Pengajuan a/n ${debtor_information.full_name}`;
  const group = employee_information.company_name;
  const date = new Date(sub.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isInProcess =
    sub.status === "submitted" || sub.status === "under_review";
  const detailUrl = isInProcess
    ? `/profile/riwayat/in-process/${sub.id}`
    : `/profile/riwayat/completed/${sub.id}`;

  return (
    <Link href={detailUrl} className="cursor-pointer">
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <img
          src={imageUrl}
          alt={title}
          className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{group}</p>
          <p className="text-sm text-gray-700">🗓️ {date}</p>
        </div>
        <StatusBadge status={sub.status} />
      </div>
    </Link>
  );
}
