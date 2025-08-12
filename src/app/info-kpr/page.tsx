import { KPRSimulator } from "@/components/kpr-simulator";

export default function InfoKPR() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Informasi KPR</h1>
        <p className="text-gray-600 mb-6">
          Kredit Pemilikan Rumah (KPR) adalah fasilitas kredit yang diberikan
          oleh bank untuk membantu nasabah dalam membeli rumah atau properti.
          Gunakan simulator di bawah ini untuk menghitung estimasi angsuran KPR
          Anda.
        </p>
      </div>

      <KPRSimulator className="mb-8" />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Tips Mengajukan KPR</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Pastikan penghasilan Anda stabil dan mencukupi</li>
          <li>Siapkan uang muka minimal 20% dari harga properti</li>
          <li>Pilih tenor yang sesuai dengan kemampuan finansial</li>
          <li>Bandingkan suku bunga dari berbagai bank</li>
          <li>Lengkapi dokumen yang diperlukan</li>
        </ul>
      </div>
    </div>
  );
}
