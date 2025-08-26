export default function formatLastViewed(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Hitung selisih waktu dalam milidetik
  const diffMs = now.getTime() - date.getTime();

  // Konversi ke hari, bulan, tahun
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  const diffYears = now.getFullYear() - date.getFullYear();

  if (diffDays === 0) {
    return "Dilihat hari ini";
  } else if (diffDays === 1) {
    return "Dilihat 1 hari yang lalu";
  } else if (diffDays < 7) {
    return `Dilihat ${diffDays} hari yang lalu`;
  } else if (diffDays < 14) {
    return "Dilihat minggu lalu";
  } else if (diffMonths === 1) {
    return "Dilihat bulan lalu";
  } else if (diffMonths < 12) {
    return `Dilihat ${diffMonths} bulan yang lalu`;
  } else if (diffYears === 1) {
    return "Dilihat tahun lalu";
  } else {
    return `Dilihat ${diffYears} tahun yang lalu`;
  }
}
