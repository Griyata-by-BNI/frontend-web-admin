// utils/handleError.ts

type ErrorPayload = {
  status?: {
    code: number;
    message?: string;
  };
};

export function handleError(
  error: ErrorPayload,
  defaultMessage?: string
): string {
  const code = error?.status?.code;
  const backendMessage = error?.status?.message || "";

  switch (code) {
    case 400:
      return "Permintaan tidak valid. Silakan periksa kembali input Anda.";
    case 401:
      return "Anda belum login atau sesi Anda sudah berakhir.";
    case 403:
      return "Anda tidak memiliki akses untuk melakukan aksi ini.";
    case 404:
      return "Data atau halaman yang Anda cari tidak ditemukan.";
    case 408:
      return "Permintaan timeout. Silakan coba lagi.";
    case 429:
      return "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.";
    case 500:
      return "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";
    case 502:
      return "Bad gateway. Server sedang bermasalah.";
    case 503:
      return "Layanan sedang tidak tersedia. Silakan coba lagi nanti.";
    case 504:
      return "Server tidak merespon. Silakan coba beberapa saat lagi.";
    default:
      return (
        defaultMessage ||
        backendMessage ||
        "Terjadi kesalahan yang tidak diketahui."
      );
  }
}
