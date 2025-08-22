"use client";

import "@ant-design/v5-patch-for-react-19";
import { useSubmissionDetail } from "@/services/approvalListServices";
import { Breadcrumb, Card, Col, Descriptions, Row, Skeleton, Tag } from "antd";
import { useParams } from "next/navigation";
import PropertyInformation from "./_components/PropertyInformation";
import interestRateData from "@/data/interest-rate.json";
import ApproveRejectButton from "./_components/ApproveRejectButton";

type InterestItem = { id: number; title: string };

export default function SubmissionDetailPage() {
  const params = useParams<{ submission_id: string }>();
  const submissionId = params?.submission_id ?? "";
  const { data, isLoading } = useSubmissionDetail(submissionId);

  const d = data?.data;
  const s = d?.submission;
  const debtor = d?.debtor_information;
  const spouse = d?.spouse_information;
  const ec = d?.emergency_contact;
  const emp = d?.employee_information;
  const loan = d?.loan_information;

  const propertyId =
    typeof loan?.property_id === "number" ? loan.property_id : undefined;

  const formatCurrency = (v?: number | string) => {
    const num = typeof v === "string" ? Number(v) : v;
    if (typeof num !== "number" || Number.isNaN(num)) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (val?: string) => {
    if (!val) return "-";
    const dt = new Date(val);
    return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString("id-ID");
  };

  const interestTitle =
    s?.interest_id != null
      ? (interestRateData as InterestItem[]).find(
          (it) => Number(it.id) === Number(s.interest_id)
        )?.title ?? "-"
      : "-";

  const descCols = { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 };

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">
          Detail Submission
        </p>
        <Breadcrumb
          items={[
            { title: "Dashboard" },
            { title: "Submissions", path: "/sales/approval-list" },
            { title: `ID ${submissionId}` },
          ]}
        />
      </div>

      <Card className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]">
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Descriptions
                title="Status Submission"
                bordered
                size="middle"
                colon={false}
                column={descCols}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Status">
                  {s?.status ? (
                    <Tag color="processing" className="capitalize">
                      {s.status}
                    </Tag>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Diajukan Pada">
                  {s?.created_at ? formatDate(s.created_at) : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Catatan Verifikasi">
                  {s?.verification_notes || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Diverifikasi Pada">
                  {s?.verified_at ? formatDate(s.verified_at) : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col span={24}>
              <Descriptions
                title="Informasi Pinjaman"
                bordered
                size="middle"
                colon={false}
                column={descCols}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Nilai Pinjaman">
                  {formatCurrency(loan?.loan_value)}
                </Descriptions.Item>
                <Descriptions.Item label="Tenor (bulan)">
                  {loan?.monthly_period ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Pilihan Suku Bunga">
                  {interestTitle}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col span={24}>
              <Descriptions
                title="Informasi Nasabah"
                bordered
                size="middle"
                colon={false}
                column={descCols}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Nama Lengkap">
                  {debtor?.full_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Ibu Kandung">
                  {debtor?.mother_maiden_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Kelamin">
                  {debtor?.gender === "L"
                    ? "Laki-laki"
                    : debtor?.gender === "P"
                    ? "Perempuan"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Lahir">
                  {formatDate(debtor?.birth_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Tempat Lahir">
                  {debtor?.place_of_birth || "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Status Pernikahan"
                  className="capitalize"
                >
                  {debtor?.marital_status
                    ? debtor?.marital_status?.replace("_", " ")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Status Tempat Tinggal"
                  className="capitalize"
                >
                  {debtor?.residence_status
                    ? debtor?.residence_status?.replace("_", " ")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NIK">
                  {debtor?.nik || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Pendidikan">
                  {debtor?.education || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP">
                  {debtor?.tax_id_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {debtor?.email || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="No. HP">
                  {debtor?.phone_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat KTP">
                  {debtor?.id_card_address || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat Domisili">
                  {debtor?.domicile_address || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {spouse && (
              <Col span={24}>
                <Descriptions
                  title="Informasi Pasangan"
                  bordered
                  size="middle"
                  colon={false}
                  column={descCols}
                  styles={{ label: { width: 220 } }}
                >
                  <Descriptions.Item label="Nama Lengkap">
                    {spouse.full_name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jenis Kelamin">
                    {spouse.gender === "L"
                      ? "Laki-laki"
                      : spouse.gender === "P"
                      ? "Perempuan"
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tanggal Lahir">
                    {formatDate(spouse.birth_date)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kewarganegaraan">
                    {spouse.nationality || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Pendidikan">
                    {spouse.education || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="NIK">
                    {spouse.nik || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="NPWP">
                    {spouse.tax_id_number || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No. HP">
                    {spouse.phone_number || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {spouse.email || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Alamat KTP">
                    {spouse.id_card_address || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            )}

            <Col span={24}>
              <Descriptions
                title="Kontak Darurat"
                bordered
                size="middle"
                colon={false}
                column={descCols}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Nama">
                  {ec?.fullName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Hubungan">
                  {ec?.relationship || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Telepon Rumah">
                  {ec?.homePhoneNumber ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="No. HP">
                  {ec?.mobilePhoneNumber ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat">
                  {ec?.address || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col span={24}>
              <Descriptions
                title="Informasi Pekerjaan Saat Ini"
                bordered
                size="middle"
                colon={false}
                column={descCols}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Jenis Pekerjaan">
                  {emp?.employment_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Perusahaan">
                  {emp?.company_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Telepon Perusahaan">
                  {emp?.phone_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jabatan">
                  {emp?.job_title || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Posisi">
                  {emp?.position || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Industri">
                  {emp?.industry_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat Perusahaan">
                  {emp?.address || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Lama Bekerja">
                  {typeof emp?.length_of_work_years === "number"
                    ? `${emp.length_of_work_years} tahun`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Gaji Pokok">
                  {formatCurrency(emp?.basic_salary)}
                </Descriptions.Item>
                <Descriptions.Item label="Penghasilan Lain">
                  {formatCurrency(emp?.other_income)}
                </Descriptions.Item>
                <Descriptions.Item label="Total Penghasilan">
                  {formatCurrency(emp?.total_income)}
                </Descriptions.Item>
                <Descriptions.Item label="Total Pengeluaran">
                  {formatCurrency(emp?.total_expenses)}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {emp?.employmentHistory && (
              <Col span={24}>
                <Descriptions
                  title="Riwayat Pekerjaan Sebelumnya"
                  bordered
                  size="middle"
                  colon={false}
                  column={descCols}
                  styles={{ label: { width: 220 } }}
                >
                  <Descriptions.Item label="Jenis Pekerjaan">
                    {emp.employmentHistory.employment_type || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nama Perusahaan">
                    {emp.employmentHistory.company_name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telepon Perusahaan">
                    {emp.employmentHistory.phone_number || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jabatan">
                    {emp.employmentHistory.job_title || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Posisi">
                    {emp.employmentHistory.position || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jenis Industri">
                    {emp.employmentHistory.industry_type || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Alamat Perusahaan">
                    {emp.employmentHistory.address || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lama Bekerja">
                    {typeof emp.employmentHistory.length_of_work_years ===
                    "number"
                      ? `${emp.employmentHistory.length_of_work_years} tahun`
                      : "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            )}

            <Col span={24}>
              <PropertyInformation propertyId={propertyId} />
            </Col>

            {s?.status === "under_review" && (
              <Col span={24}>
                <ApproveRejectButton />
              </Col>
            )}
          </Row>
        )}
      </Card>
    </div>
  );
}
