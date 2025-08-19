import { ApiStatus } from "../types";

interface StatusBadgeProps {
  status: ApiStatus;
}

const getStatusInfo = (status: ApiStatus) => {
  switch (status) {
    case "verified":
    case "completed":
      return { text: "Disetujui", style: "bg-green-500" };
    case "rejected":
      return { text: "Ditolak", style: "bg-red-500" };
    case "submitted":
    case "under_review":
    default:
      return { text: "Diproses", style: "bg-blue-500" };
  }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { text, style } = getStatusInfo(status);

  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-medium text-white whitespace-nowrap ${style}`}
    >
      {text}
    </div>
  );
}
