import { InfoCard } from "./InfoCard";
import { FileText, User, Users, Briefcase } from "lucide-react";

const dataNasabah = [
  { label: "Nama Lengkap", value: "Nafira Elba" },
  { label: "Nama Lengkap Ibu Kandung", value: "Citra Lestari" },
  { label: "NIK", value: "3171234567890001" },
  { label: "Nomor Handphone", value: "081234567890" },
  { label: "NPWP", value: "98.765.432.1-012.000" },
  { label: "Tempat Lahir", value: "Jakarta" },
  { label: "Tanggal Lahir", value: "15-08-2001" },
  { label: "Agama", value: "Islam" },
  { label: "Pendidikan Terakhir", value: "S1 Teknik Informatika" },
  { label: "Jenis Kelamin", value: "Perempuan" },
  { label: "Status Tempat Tinggal", value: "Milik Sendiri" },
  { label: "Alamat KTP", value: "Jl. Merdeka No. 10, Jakarta Pusat" },
  { label: "Alamat Domisili", value: "Jl. Merdeka No. 10, Jakarta Pusat" },
];

const dataPasangan = [
  { label: "Nama Lengkap", value: "Edbert Tanu" },
  { label: "Nama Lengkap Ibu Kandung", value: "Dewi Tanu" },
  { label: "NIK", value: "3171234567890002" },
  { label: "Nomor Handphone", value: "089876543210" },
];

const dataPekerjaan = [
  { label: "Pekerjaan Saat Ini", value: "Karyawan BUMN" },
  { label: "Nama Perusahaan", value: "PT Bank Negara Indonesia (Persero) Tbk" },
  {
    label: "Alamat Perusahaan",
    value: "Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan",
  },
  { label: "Kontak Perusahaan", value: "021-5151234" },
  { label: "Nama Pekerjaan", value: "Software Engineer" },
  { label: "Jabatan", value: "ODP Trainee" },
  { label: "Jenis Industri", value: "Finance & Banking" },
  { label: "Lama Bekerja", value: "1 Tahun" },
  { label: "Gaji Pokok", value: "Rp 15.000.000" },
  { label: "Pendapatan Lainnya", value: "Rp 2.000.000" },
  { label: "Total Pendapatan", value: "Rp 17.000.000" },
  { label: "Total Pengeluaran dalam Sebulan", value: "Rp 8.000.000" },
];

const dataDokumen = [
  "KTP",
  "NPWP",
  "KTP Pasangan",
  "Kartu Keluarga",
  "Buku Nikah",
  "Surat Keterangan Kerja Terbaru",
  "Slip Gaji 3 Bulan Terakhir",
  "Rekening Koran 3 Bulan Terakhir",
];

export const PengajuanKPRView = () => {
  return (
    <div className="space-y-8">
      <InfoCard
        title="Informasi Nasabah"
        details={dataNasabah}
        icon={<User className="w-6 h-6 text-gray-500" />}
      />
      <InfoCard
        title="Informasi Pasangan"
        details={dataPasangan}
        icon={<Users className="w-6 h-6 text-gray-500" />}
      />
      <InfoCard
        title="Informasi Pekerjaan"
        details={dataPekerjaan}
        icon={<Briefcase className="w-6 h-6 text-gray-500" />}
      />

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <FileText className="w-6 h-6 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-800">Dokumen Terkirim</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 list-inside list-disc marker:text-teal-500">
          {dataDokumen.map((doc, index) => (
            <li key={index} className="text-gray-700">
              {doc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
