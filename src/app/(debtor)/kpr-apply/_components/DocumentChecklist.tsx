import { CheckCircle } from "lucide-react";

const documents = [
  "Kartu Tanda Penduduk (KTP)",
  "Kartu Keluarga",
  "Kartu NPWP",
  "Surat Keterangan Kerja",
  "Slip Gaji 3 Bulan Terakhir",
  "Buku Nikah (*jika ada)",
  "KTP Pasangan (*jika ada)",
];

export const DocumentChecklist = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
        Anda Perlu Menyiapkan Ini
      </h2>
      <ul className="space-y-3">
        {documents.map((doc, index) => (
          <li key={index} className="flex items-center">
            <div className="w-6 h-6 flex-shrink-0 bg-teal-100 rounded-full flex items-center justify-center mr-4">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            </div>
            <span className="text-gray-700">{doc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
