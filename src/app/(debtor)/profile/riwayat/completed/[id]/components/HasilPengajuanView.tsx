import { useMemo } from "react";
import { generateApplicationCode } from "@/utils/constants";
import { clsx } from "clsx";

interface HasilPengajuanViewProps {
  status: "selesai" | "dalam_proses";
  submissionId: number;
  verificationNotes?: string;
}

const Illustration = ({ status }: { status: "selesai" | "dalam_proses" }) => {
  const isCompleted = status === "selesai";
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-sm h-64 rounded-lg flex items-center justify-center",
        isCompleted ? "bg-green-50" : "bg-blue-50"
      )}
    >
      <svg
        className={clsx(
          "w-24 h-24",
          isCompleted ? "text-green-400" : "text-blue-400"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {isCompleted ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
      </svg>
    </div>
  );
};

const CONTENT = {
  selesai: {
    title: "telah selesai diproses",
    message:
      "Pengajuan KPR Anda telah selesai diproses. Mohon menunggu customer service untuk menghubungi Anda.",
  },
  dalam_proses: {
    title: "sedang dalam proses",
    message:
      "Pengajuan KPR Anda masih dalam tahap pemrosesan. Mohon tunggu untuk informasi selanjutnya.",
  },
} as const;

export const HasilPengajuanView = ({
  status,
  submissionId,
  verificationNotes,
}: HasilPengajuanViewProps) => {
  const { title, message } = CONTENT[status];

  const applicationCode = useMemo(() => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    return `${dateStr}${submissionId.toString().padStart(3, "0")}`;
  }, [submissionId]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <Illustration status={status} />
      <h3 className="text-xl font-semibold text-gray-800 mt-8">
        Pengajuan dengan Kode Aplikasi{" "}
        <span
          className={status === "selesai" ? "text-green-600" : "text-blue-600"}
        >
          {applicationCode}
        </span>{" "}
        {title}
      </h3>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">{message}</p>

      {verificationNotes && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">
            Catatan Verifikasi:
          </h4>
          <p className="text-gray-600 text-sm">{verificationNotes}</p>
        </div>
      )}
    </div>
  );
};
