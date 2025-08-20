interface HasilPengajuanViewProps {
  status: "disetujui" | "ditolak";
  submissionId: number;
  verificationNotes?: string;
}

const Illustration = ({ status }: { status: "disetujui" | "ditolak" }) => {
  const isApproved = status === "disetujui";
  return (
    <div
      className={`mx-auto w-full max-w-sm h-64 rounded-lg flex items-center justify-center ${
        isApproved ? "bg-teal-50" : "bg-red-50"
      }`}
    >
      <svg
        className={`w-24 h-24 ${isApproved ? "text-teal-400" : "text-red-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {isApproved ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        )}
      </svg>
    </div>
  );
};

const content = {
  disetujui: {
    title: "telah disetujui",
    message:
      "Mohon menunggu, tim kami akan segera menghubungi Anda untuk proses selanjutnya.",
  },
  ditolak: {
    title: "telah ditolak",
    message:
      "Mohon maaf, pengajuan Anda belum dapat kami setujui saat ini. Silakan hubungi customer service untuk informasi lebih lanjut.",
  },
};

export const HasilPengajuanView = ({
  status,
  submissionId,
  verificationNotes,
}: HasilPengajuanViewProps) => {
  const { title, message } = content[status];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <Illustration status={status} />
      <h3 className="text-xl font-semibold text-gray-800 mt-8">
        Pengajuan dengan Kode Aplikasi{" "}
        <span
          className={status === "disetujui" ? "text-teal-600" : "text-red-600"}
        >
          {submissionId}
        </span>{" "}
        {title}
      </h3>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">{message}</p>
      
      {verificationNotes && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Catatan Verifikasi:</h4>
          <p className="text-gray-600 text-sm">{verificationNotes}</p>
        </div>
      )}
    </div>
  );
};