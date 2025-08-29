"use client";

import interestRateData from "@/data/interest-rate.json";
import {
  useSubmissionDetail,
  useUpdateSubmissionStatus,
} from "@/services/approvalListServices";
import "@ant-design/v5-patch-for-react-19";
import {
  App,
  Breadcrumb,
  Card,
  Col,
  Descriptions,
  Grid,
  Row,
  Skeleton,
  Tag,
  type DescriptionsProps,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import ApproveRejectButton from "./_components/ApproveRejectButton";
import DocumentPreview from "./_components/DocumentPreview";
import PropertyInformation from "./_components/PropertyInformation";

type InterestItem = { id: number; title: string };

export default function SubmissionDetailPage() {
  const { message } = App.useApp();
  const params = useParams<{ submission_id: string }>();
  const submissionId = params?.submission_id ?? "";
  const { data, isLoading } = useSubmissionDetail(submissionId);
  const { mutate: updateStatus } = useUpdateSubmissionStatus();
  const router = useRouter();
  const screens = Grid.useBreakpoint();

  useEffect(() => {
    if (data?.data?.submission?.status === "submitted") {
      updateStatus(
        { id: submissionId, payload: { status: "under_review" } },
        {
          onError: () => message.error("Gagal memperbarui status"),
        }
      );
    }
  }, [data?.data?.submission?.status, submissionId, updateStatus, message]);

  const d = data?.data;
  const s = d?.submission;
  const debtor = d?.debtor_information;
  const spouse = d?.spouse_information;
  const ec = d?.emergency_contact;
  const emp = d?.employee_information;
  const loan = d?.loan_information;
  const documents = d?.documents;

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

  // ====== Responsiveness helpers ======
  const descColumn = screens.lg ? 2 : 1;
  const descLayout: DescriptionsProps["layout"] = screens.md
    ? "horizontal"
    : "vertical";
  const labelWidth = screens.md ? 220 : undefined;
  const gutter: [number, number] = screens.md ? [24, 24] : [16, 16];

  const statusColor: Record<
    string,
    "processing" | "warning" | "success" | "error"
  > = {
    submitted: "warning",
    under_review: "processing",
    verified: "success",
    rejected: "error",
  };

  const commonDescProps: Partial<DescriptionsProps> = {
    bordered: true,
    size: "middle",
    colon: false,
    column: descColumn,
    layout: descLayout,
    styles: {
      label: { width: labelWidth },
      content: { wordBreak: "break-word", whiteSpace: "pre-wrap" },
    },
  };

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">
          Detail Submission
        </p>
        <Breadcrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Submissions",
              onClick: () => router.push(`/sales/approval-list`),
            },
            { title: `ID ${submissionId}` },
          ]}
        />
      </div>

      <Card className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]">
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Row gutter={gutter}>
            {/* Status */}
            <Col span={24}>
              <Descriptions title="Status Submission" {...commonDescProps}>
                <Descriptions.Item label="Status">
                  {s?.status ? (
                    <Tag
                      color={statusColor[s.status] ?? "processing"}
                      className="capitalize"
                    >
                      {s.status.replace("_", " ")}
                    </Tag>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Diajukan Pada">
                  {formatDate(s?.created_at)}
                </Descriptions.Item>
                <Descriptions.Item label="Catatan Verifikasi">
                  <span className="break-words">
                    {s?.verification_notes || "-"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Diverifikasi Pada">
                  {formatDate(s?.verified_at)}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Loan */}
            <Col span={24}>
              <Descriptions title="Informasi Pinjaman" {...commonDescProps}>
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

            {/* Debtor */}
            <Col span={24}>
              <Descriptions title="Informasi Nasabah" {...commonDescProps}>
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
                    ? debtor.marital_status.replace("_", " ")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Status Tempat Tinggal"
                  className="capitalize"
                >
                  {debtor?.residence_status
                    ? debtor.residence_status.replace("_", " ")
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
                  <span className="break-words">
                    {debtor?.id_card_address || "-"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Alamat Domisili">
                  <span className="break-words">
                    {debtor?.domicile_address || "-"}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Spouse (optional) */}
            {spouse && (
              <Col span={24}>
                <Descriptions title="Informasi Pasangan" {...commonDescProps}>
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
                    <span className="break-words">
                      {spouse.id_card_address || "-"}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            )}

            {/* Emergency Contact */}
            <Col span={24}>
              <Descriptions title="Kontak Darurat" {...commonDescProps}>
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
                  <span className="break-words">{ec?.address || "-"}</span>
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Employment */}
            <Col span={24}>
              <Descriptions
                title="Informasi Pekerjaan Saat Ini"
                {...commonDescProps}
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
                  <span className="break-words">{emp?.address || "-"}</span>
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

            {/* Employment History (optional) */}
            {emp?.employmentHistory && (
              <Col span={24}>
                <Descriptions
                  title="Riwayat Pekerjaan Sebelumnya"
                  {...commonDescProps}
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
                    <span className="break-words">
                      {emp.employmentHistory.address || "-"}
                    </span>
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

            {/* Property */}
            <Col span={24}>
              <PropertyInformation propertyId={propertyId} />
            </Col>

            {/* Documents */}
            {documents && documents.length > 0 && (
              <Col span={24}>
                <Card
                  title="Dokumen Pendukung"
                  className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
                >
                  <DocumentPreview documents={documents} />
                </Card>
              </Col>
            )}

            {/* Actions */}
            {s?.status === "under_review" && (
              <Col span={24}>
                {/* biar enak di mobile, tombol lebar penuh */}
                <div className="w-full md:w-auto">
                  <ApproveRejectButton />
                </div>
              </Col>
            )}
          </Row>
        )}
      </Card>
    </div>
  );
}
