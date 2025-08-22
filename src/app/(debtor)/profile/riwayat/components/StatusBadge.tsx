import { ApiStatus } from "@/types/riwayat";
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/constants";
import { clsx } from "clsx";

interface StatusBadgeProps {
  status: ApiStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-500";
  const label = STATUS_LABELS[status] || "Diproses";

  return (
    <div
      className={clsx(
        "px-3 py-1.5 rounded-full text-xs font-medium text-white whitespace-nowrap",
        colorClass
      )}
    >
      {label}
    </div>
  );
}