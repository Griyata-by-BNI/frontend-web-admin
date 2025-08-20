import { InfoCard } from "./InfoCard";
import { SubmissionDetail } from "@/types/riwayat";
import { FileText, User, Users, Briefcase, Phone } from "lucide-react";

interface PengajuanKPRViewProps {
  submissionData: SubmissionDetail;
}

export const PengajuanKPRView = ({ submissionData }: PengajuanKPRViewProps) => {
  const { debtor_information, spouse_information, employee_information, emergency_contact } =
    submissionData;

  const dataNasabah = [
    { label: "Nama Lengkap", value: debtor_information.full_name },
    { label: "Nama Lengkap Ibu Kandung", value: debtor_information.mother_maiden_name },
    { label: "Jenis Kelamin", value: debtor_information.gender === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Tanggal Lahir", value: new Date(debtor_information.birth_date).toLocaleDateString("id-ID") },
    { label: "Tempat Lahir", value: debtor_information.place_of_birth },
    { label: "Status Pernikahan", value: debtor_information.marital_status },
    { label: "NIK", value: debtor_information.nik },
    { label: "NPWP", value: debtor_information.tax_id_number },
    { label: "Email", value: debtor_information.email },
    { label: "Nomor Handphone", value: debtor_information.phone_number },
  ];

  const dataPasangan = spouse_information ? [
    { label: "Nama Lengkap", value: spouse_information.full_name },
    { label: "Jenis Kelamin", value: spouse_information.gender === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Tanggal Lahir", value: new Date(spouse_information.birth_date).toLocaleDateString("id-ID") },
    { label: "Kewarganegaraan", value: spouse_information.nationality },
    { label: "Pendidikan", value: spouse_information.education },
    { label: "NIK", value: spouse_information.nik },
    { label: "NPWP", value: spouse_information.tax_id_number },
    { label: "Nomor Handphone", value: spouse_information.phone_number },
    { label: "Email", value: spouse_information.email },
  ] : [];

  const dataKontak = [
    { label: "Nama Lengkap", value: emergency_contact.fullName },
    { label: "Alamat", value: emergency_contact.address },
    { label: "RT/RW", value: `${emergency_contact.rt.toString().padStart(3, '0')}/${emergency_contact.rw.toString().padStart(3, '0')}` },
    { label: "Kota", value: emergency_contact.city },
    { label: "Kode Pos", value: emergency_contact.postalCode.toString() },
    { label: "Telepon Rumah", value: emergency_contact.homePhoneNumber.toString() },
    { label: "Nomor HP", value: emergency_contact.mobilePhoneNumber.toString() },
    { label: "Hubungan", value: emergency_contact.relationship },
  ];

  const dataPekerjaan = [
    { label: "Jenis Pekerjaan", value: employee_information.employment_type },
    { label: "Nama Perusahaan", value: employee_information.company_name },
    { label: "Alamat Perusahaan", value: employee_information.address },
    { label: "Kota", value: employee_information.city },
    { label: "Kode Pos", value: employee_information.postal_code },
    { label: "Telepon Perusahaan", value: employee_information.phone_number },
    { label: "Jabatan", value: employee_information.job_title },
    { label: "Posisi", value: employee_information.position },
    { label: "Jenis Industri", value: employee_information.industry_type },
    { label: "Lama Bekerja", value: `${employee_information.length_of_work_years} Tahun ${employee_information.length_of_work_months} Bulan` },
    { label: "Gaji Pokok", value: `Rp ${employee_information.basic_salary.toLocaleString("id-ID")}` },
    { label: "Pendapatan Lain", value: `Rp ${employee_information.other_income.toLocaleString("id-ID")}` },
    { label: "Total Pendapatan", value: `Rp ${employee_information.total_income.toLocaleString("id-ID")}` },
    { label: "Total Pengeluaran", value: `Rp ${employee_information.total_expenses.toLocaleString("id-ID")}` },
  ];

  const dataDokumen = ["KTP", "NPWP", "Kartu Keluarga", "Buku Nikah", "Slip Gaji", "Rekening Koran"];

  return (
    <div className="space-y-8">
      <InfoCard
        title="Informasi Nasabah"
        details={dataNasabah}
        icon={<User className="w-6 h-6 text-gray-500" />}
      />
      
      {spouse_information && (
        <InfoCard
          title="Informasi Pasangan"
          details={dataPasangan}
          icon={<Users className="w-6 h-6 text-gray-500" />}
        />
      )}
      
      <InfoCard
        title="Kontak Darurat"
        details={dataKontak}
        icon={<Phone className="w-6 h-6 text-gray-500" />}
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