import { ApiStatus } from "@/types/riwayat";

interface StatusBadgeProps {
  status: ApiStatus;
}

const getStatusInfo = (status: ApiStatus) => {
  switch (status) {
    case "done":
      return { text: "Selesai", style: "bg-green-500" };
    case "submitted":
      return { text: "Diajukan", style: "bg-blue-500" };
    case "under_review":
      return { text: "Direview", style: "bg-yellow-500" };
    default:
      return { text: "Diproses", style: "bg-gray-500" };
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