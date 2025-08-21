"use client";
import {
  Card,
  Button,
  Row,
  Col,
  Descriptions,
  Tag,
  Form,
  Checkbox,
  App,
} from "antd";
import { useState } from "react";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useShallow } from "zustand/react/shallow";
import interestRateData from "@/data/interest-rate.json";
import { useSubmitAllKpr } from "../_utils/useSubmitAllKpr";
import { useRouter } from "next/navigation";

export default function SummaryForm() {
  const { formData, prev, next } = useKprApplyStore(
    useShallow((s) => ({
      formData: s.formData,
      prev: s.prev,
      next: s.next,
    }))
  );

  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const [canSubmit, setCanSubmit] = useState(false);

  const formatCurrency = (value?: number) =>
    typeof value === "number"
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(value)
      : "-";

  const formatDate = (d: any) => {
    if (!d) return "-";
    if (typeof d?.format === "function") return d.format("DD/MM/YYYY");
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString("id-ID");
  };

  const yesNoTag = (ok: boolean) => (
    <Tag color={ok ? "green" : "red"}>
      {ok ? "Sudah diunggah" : "Belum diunggah"}
    </Tag>
  );

  const hasEmploymentHistory =
    !!formData?.employmentHistory &&
    Object.values(formData.employmentHistory).some(
      (v) => v !== undefined && v !== null && v !== ""
    );

  const interestLabel = (() => {
    const id = formData?.interestRate;
    if (id === undefined || id === null) return "-";
    const found = (interestRateData as any[]).find(
      (r) => r.id === id || String(r.id) === String(id)
    );
    return found?.title ?? "-";
  })();

  const handleValuesChange = () => {
    const a = form.getFieldValue("agree_data_truth");
    const b = form.getFieldValue("agree_document_clarify");
    setCanSubmit(Boolean(a && b));
  };

  const { submitAll, loading } = useSubmitAllKpr();

  const handleSubmit = async () => {
    modal.confirm({
      title: "Konfirmasi Pengajuan",
      icon: <></>,
      okText: "Kirim Pengajuan",
      cancelText: "Periksa Kembali",
      okButtonProps: { type: "primary" },
      content: (
        <div className="flex flex-col gap-2 text-[13px] leading-5 mb-4">
          <p>
            Apakah Anda sudah <b>YAKIN</b> dengan seluruh informasi yang Anda
            isi dan dokumen yang Anda unggah?
          </p>

          <p className="text-red-500">
            Setelah pengajuan dikirim, Anda tidak dapat mengubah data pengajuan.
          </p>
        </div>
      ),
      onOk: async () => {
        await submitAll(formData);
      },
    });
  };

  return (
    <div className="mt-4">
      <Card
        title={<p className="text-sm">Ringkasan Pengajuan</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Descriptions
              title="Informasi Pinjaman"
              bordered
              size="middle"
              colon={false}
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
              styles={{ label: { width: 220 } }}
            >
              <Descriptions.Item label="Jumlah Pinjaman">
                {formatCurrency(formData?.loanAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Uang Muka">
                {formatCurrency(formData?.downPayment)}
              </Descriptions.Item>
              <Descriptions.Item label="Tenor">
                {formData?.tenor ? `${formData.tenor} bulan` : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Suku Bunga">
                {interestLabel}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={24}>
            <Descriptions
              title="Informasi Nasabah"
              bordered
              size="middle"
              colon={false}
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
              styles={{ label: { width: 220 } }}
            >
              <Descriptions.Item label="Nama Lengkap">
                {formData?.full_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="NIK">
                {formData?.nik || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="NPWP">
                {formData?.tax_id_number || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Ibu Kandung">
                {formData?.mother_maiden_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {formData?.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="No. HP">
                {formData?.phone_number || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tempat Lahir">
                {formData?.place_of_birth || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal Lahir">
                {formatDate(formData?.birth_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Pendidikan">
                {formData?.education || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Kelamin">
                {formData?.gender === "L"
                  ? "Laki-laki"
                  : formData?.gender === "P"
                  ? "Perempuan"
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status Tempat Tinggal" span={2}>
                {formData?.residence_status || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Alamat KTP" span={3}>
                {formData?.id_card_address || "-"}
              </Descriptions.Item>
              {!formData?.same_as_ktp && (
                <Descriptions.Item label="Alamat Domisili" span={3}>
                  {formData?.domicile_address || "-"}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>

          <Col span={24}>
            <Descriptions
              title="Kontak Darurat"
              bordered
              size="middle"
              colon={false}
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
              styles={{ label: { width: 220 } }}
            >
              <Descriptions.Item label="Nama">
                {formData?.emergency_contact_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Hubungan">
                {formData?.emergency_contact_relationship || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Telepon Rumah">
                {formData?.emergency_contact_home_phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="No. HP">
                {formData?.emergency_contact_mobile_phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Alamat" span={2}>
                {formData?.emergency_contact_address || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {formData?.is_married && formData?.spouse_information && (
            <Col span={24}>
              <Descriptions
                title="Informasi Pasangan"
                bordered
                size="middle"
                colon={false}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Nama Lengkap">
                  {formData.spouse_information.full_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NIK">
                  {formData.spouse_information.nik || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP">
                  {formData.spouse_information.tax_id_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Kelamin">
                  {formData.spouse_information.gender === "L"
                    ? "Laki-laki"
                    : formData.spouse_information.gender === "P"
                    ? "Perempuan"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Lahir">
                  {formatDate(formData.spouse_information.birth_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Kewarganegaraan">
                  {formData.spouse_information.nationality || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Pendidikan">
                  {formData.spouse_information.education || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {formData.spouse_information.email || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="No. HP">
                  {formData.spouse_information.phone_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat KTP" span={3}>
                  {formData.spouse_information.id_card_address || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}

          <Col span={24}>
            <Descriptions
              title="Informasi Pekerjaan Saat Ini"
              bordered
              size="middle"
              colon={false}
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
              styles={{ label: { width: 220 } }}
            >
              <Descriptions.Item label="Jenis Pekerjaan">
                {formData?.employment_type || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Perusahaan">
                {formData?.company_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Telepon Perusahaan">
                {formData?.company_phone_number || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Jabatan">
                {formData?.job_title || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Posisi">
                {formData?.position || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Industri">
                {formData?.industry_type || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Alamat Perusahaan" span={3}>
                {formData?.address || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Lama Bekerja">
                {formData?.length_of_work_years
                  ? `${formData.length_of_work_years} tahun`
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Gaji Pokok">
                {formatCurrency(formData?.basic_salary)}
              </Descriptions.Item>
              <Descriptions.Item label="Penghasilan Lain">
                {formatCurrency(formData?.other_income)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Penghasilan">
                {formatCurrency(formData?.total_income)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Pengeluaran" span={2}>
                {formatCurrency(formData?.total_expenses)}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {hasEmploymentHistory && (
            <Col span={24}>
              <Descriptions
                title="Riwayat Pekerjaan Sebelumnya"
                bordered
                size="middle"
                colon={false}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: 220 } }}
              >
                <Descriptions.Item label="Jenis Pekerjaan">
                  {formData.employmentHistory.employment_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Perusahaan">
                  {formData.employmentHistory.company_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Telepon Perusahaan">
                  {formData.employmentHistory.phone_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jabatan">
                  {formData.employmentHistory.job_title || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Posisi">
                  {formData.employmentHistory.position || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Industri">
                  {formData.employmentHistory.industry_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat Perusahaan" span={3}>
                  {formData.employmentHistory.address || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Lama Bekerja" span={3}>
                  {formData.employmentHistory.length_of_work_years
                    ? `${formData.employmentHistory.length_of_work_years} tahun`
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}

          <Col span={24}>
            <Descriptions
              title="Dokumen"
              bordered
              size="middle"
              colon={false}
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
              styles={{ label: { width: 220 } }}
            >
              <Descriptions.Item label="KTP">
                {yesNoTag(
                  Array.isArray(formData?.id_card) &&
                    formData.id_card.length > 0
                )}
              </Descriptions.Item>
              <Descriptions.Item label="NPWP">
                {yesNoTag(
                  Array.isArray(formData?.tax_id) && formData.tax_id.length > 0
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Sertifikat Pekerjaan">
                {yesNoTag(
                  Array.isArray(formData?.employment_certificate) &&
                    formData.employment_certificate.length > 0
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Slip Gaji">
                {yesNoTag(
                  Array.isArray(formData?.salary_slip) &&
                    formData.salary_slip.length > 0
                )}
              </Descriptions.Item>
              {formData?.is_married && (
                <>
                  <Descriptions.Item label="KTP Pasangan">
                    {yesNoTag(
                      Array.isArray(formData?.spouse_id_card) &&
                        formData.spouse_id_card.length > 0
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Buku Nikah">
                    {yesNoTag(
                      Array.isArray(formData?.marriage_certificate) &&
                        formData.marriage_certificate.length > 0
                    )}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Col>

          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleValuesChange}
              className="mt-4"
            >
              <Form.Item
                name="agree_data_truth"
                valuePropName="checked"
                className="!mb-2"
              >
                <Checkbox>
                  Semua informasi dan dokumen yang saya lampirkan dalam
                  permohonan ini adalah benar dan apabila terdapat perubahan
                  data dalam aplikasi, saya wajib segera memberikan informasi
                  terbaru kepada BNI.
                </Checkbox>
              </Form.Item>

              <Form.Item name="agree_document_clarify" valuePropName="checked">
                <Checkbox>
                  Dengan memberikan tanda ini, debitur menyatakan setuju dan
                  mengklarifikasi dokumen yang dilampirkan.
                </Checkbox>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <div className="flex justify-between mt-6">
          <Button size="large" className="px-8" onClick={prev}>
            Kembali
          </Button>

          <Button
            type="primary"
            size="large"
            className="px-8"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit Pengajuan
          </Button>
        </div>
      </Card>
    </div>
  );
}
