import { InfoCard } from "./InfoCard";
import { FileText, User, Users, Briefcase } from "lucide-react";
import { SubmissionDetail } from "../../../types";

export const PengajuanKPRView = ({
  submissionData,
}: {
  submissionData: SubmissionDetail;
}) => {
  const { debtor_information, spouse_information, employee_information } =
    submissionData;

  const dataNasabah = [
    { label: "Nama Lengkap", value: debtor_information.full_name },
  ];

  const dataPasangan = spouse_information
    ? [{ label: "Nama Lengkap", value: spouse_information.full_name }]
    : [];

  const dataPekerjaan = [
    { label: "Nama Perusahaan", value: employee_information.company_name },
  ];

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
        title="Informasi Pekerjaan"
        details={dataPekerjaan}
        icon={<Briefcase className="w-6 h-6 text-gray-500" />}
      />
    </div>
  );
};
