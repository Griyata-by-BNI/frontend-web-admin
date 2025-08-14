const IllustrationPlaceholder = () => (
  <div className="mx-auto bg-blue-50 w-full max-w-sm h-64 rounded-lg flex items-center justify-center">
    <svg
      className="w-24 h-24 text-blue-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3"
      />
    </svg>
  </div>
);

export const VerifikasiView = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <IllustrationPlaceholder />
      <h3 className="text-xl font-semibold text-gray-800 mt-8">
        Pengajuan dengan Kode Aplikasi{" "}
        <span className="text-teal-600">287472384</span> saat ini sedang dalam
        proses verifikasi
      </h3>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        Tim kami sedang memeriksa kelengkapan dan keabsahan data serta dokumen
        yang telah Anda kirimkan.
      </p>
    </div>
  );
};
