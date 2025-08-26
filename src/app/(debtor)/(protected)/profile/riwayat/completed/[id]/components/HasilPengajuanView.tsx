import { useMemo } from "react";
import { generateApplicationCode } from "@/utils/constants";
import Image from "next/image";



const Illustration = ({ status }: { status: "selesai" | "dalam_proses" | "ditolak" }) => {
  const getImageSrc = () => {
    switch (status) {
      case "selesai":
        return "/images/Approved.png";
      case "ditolak":
        return "/images/Rejected.png";
      case "dalam_proses":
      default:
        return "/images/Under_Review.png";
    }
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
  ditolak: {
    title: "telah ditolak",
    message:
      "Pengajuan KPR Anda telah ditolak. Silakan hubungi customer service untuk informasi lebih lanjut.",
  },
} as const;

interface HasilPengajuanViewProps {
  status: "selesai" | "dalam_proses" | "ditolak";
  submissionId: number;
  submittedAt?: string;
  verificationNotes?: string;
}

export const HasilPengajuanView = ({
  status,
  submissionId,
  submittedAt,
  verificationNotes,
}: HasilPengajuanViewProps) => {
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
        <span
          className={status === "selesai" ? "text-green-600" : status === "ditolak" ? "text-red-600" : "text-blue-600"}
        >
          {applicationCode || `APP${submissionId || 'UNKNOWN'}`}
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
