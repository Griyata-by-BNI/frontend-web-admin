export const SUBMISSION_STEPS = {
  PENGAJUAN: 1,
  VERIFIKASI: 2,
  HASIL: 3,
} as const;

export const STATUS_COLORS = {
  verified: "bg-green-500",
  submitted: "bg-blue-500",
  under_review: "bg-yellow-500",
} as const;

export const STATUS_LABELS = {
  verified: "Selesai",
  submitted: "Diajukan",
  under_review: "Direview",
} as const;

export const generateApplicationCode = (
  submittedAt: string | null,
  submissionId: number
): string => {
  // Kalau null atau invalid, pakai tanggal hari ini
  const date = submittedAt ? new Date(submittedAt) : new Date();
  if (isNaN(date.getTime())) {
    // fallback juga kalau stringnya invalid
    date.setTime(Date.now());
  }

  // Format tanggal lokal YYYYMMDD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Submission ID minimal 3 digit (001, 002, dst.)
  const idStr = String(submissionId).padStart(3, "0");

  return `${dateStr}${idStr}`;
};
