import { useMemo } from "react";
import Image from "next/image";
import { generateApplicationCode } from "@/utils/constants";

interface StatusResultViewProps {
  status: "Diajukan" | "Sedang Diproses";
  submissionId: number;
  submittedAt?: string;
}

const Illustration = ({ status }: { status: "Diajukan" | "Sedang Diproses" }) => {
  const getImageSrc = () => {
    return status === "Sedang Diproses" 
      ? "/images/Under_Review.png"
      : "/images/Under_Review.png"; // Both use Under_Review for in-process states
  };

  return (
    <div className="mx-auto w-full max-w-sm h-64 flex items-center justify-center">
      <Image
        src={getImageSrc()}
        alt={`Status ${status}`}
        width={200}
        height={200}
        className="object-contain"
      />
    </div>
  );
};

const CONTENT = {
  "Diajukan": {
    title: "telah diajukan",
    message: "Pengajuan KPR Anda telah berhasil disubmit dan sedang menunggu untuk diproses oleh tim kami.",
  },
  "Sedang Diproses": {
    title: "sedang diproses",
    message: "Pengajuan KPR Anda sedang dalam tahap verifikasi. Mohon tunggu untuk informasi selanjutnya.",
  },
} as const;

export const StatusResultView = ({
  status,
  submissionId,
  submittedAt,
}: StatusResultViewProps) => {
  const { title, message } = CONTENT[status];

  const applicationCode = useMemo(() => {
    if (!submissionId) return "";
    return generateApplicationCode(submittedAt || null, submissionId);
  }, [submissionId, submittedAt]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <Illustration status={status} />
      <h3 className="text-xl font-semibold text-gray-800 mt-8">
        Pengajuan dengan Kode Aplikasi{" "}
        <span className={status === "Sedang Diproses" ? "text-yellow-600" : "text-blue-600"}>
          {applicationCode}
        </span>{" "}
        {title}
      </h3>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">{message}</p>
    </div>
  );
};