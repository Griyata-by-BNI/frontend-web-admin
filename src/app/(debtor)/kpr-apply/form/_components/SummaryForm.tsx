"use client";
import { Card, Button, Row, Col, Descriptions } from "antd";

interface SummaryFormProps {
  onNext?: () => void;
  onPrev?: () => void;
  formData?: any;
}

export default function SummaryForm({
  onNext,
  onPrev,
  formData,
}: SummaryFormProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const formatDate = (date: any) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <div className="mt-4">
      <Card
        title={<p className="text-sm">Ringkasan Pengajuan</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Descriptions title="Informasi Pinjaman" bordered size="small">
              <Descriptions.Item label="Jumlah Pinjaman" span={2}>
                {formData?.loanAmount ? formatCurrency(formData.loanAmount) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Uang Muka">
                {formData?.downPayment ? formatCurrency(formData.downPayment) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tenor" span={3}>
                {formData?.tenor ? `${formData.tenor} bulan` : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={24}>
            <Descriptions title="Informasi Nasabah" bordered size="small">
              <Descriptions.Item label="Nama Lengkap" span={2}>
                {formData?.full_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="NIK">
                {formData?.nik || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="NPWP" span={2}>
                {formData?.tax_id_number || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Ibu Kandung">
                {formData?.mother_maiden_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
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
                {formData?.gender === "L" ? "Laki-laki" : formData?.gender === "P" ? "Perempuan" : "-"}
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
            <Descriptions title="Kontak Darurat" bordered size="small">
              <Descriptions.Item label="Nama" span={2}>
                {formData?.emergency_contact_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Hubungan">
                {formData?.emergency_contact_relationship || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Telepon Rumah">
                {formData?.emergency_contact_home_phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="No. HP" span={2}>
                {formData?.emergency_contact_mobile_phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Alamat" span={3}>
                {formData?.emergency_contact_address || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {formData?.is_married && formData?.spouse_information && (
            <Col span={24}>
              <Descriptions title="Informasi Pasangan" bordered size="small">
                <Descriptions.Item label="Nama Lengkap" span={2}>
                  {formData.spouse_information.full_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NIK">
                  {formData.spouse_information.nik || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP" span={2}>
                  {formData.spouse_information.tax_id_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Kelamin">
                  {formData.spouse_information.gender === "L" ? "Laki-laki" : formData.spouse_information.gender === "P" ? "Perempuan" : "-"}
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
                <Descriptions.Item label="Email" span={2}>
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
            <Descriptions title="Informasi Pekerjaan Saat Ini" bordered size="small">
              <Descriptions.Item label="Jenis Pekerjaan" span={2}>
                {formData?.employment_type || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Perusahaan">
                {formData?.company_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Alamat Perusahaan" span={3}>
                {formData?.address || "-"}
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
              <Descriptions.Item label="Lama Bekerja" span={2}>
                {formData?.length_of_work_years ? `${formData.length_of_work_years} tahun` : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Gaji Pokok">
                {formData?.basic_salary ? formatCurrency(formData.basic_salary) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Penghasilan Lain">
                {formData?.other_income ? formatCurrency(formData.other_income) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Penghasilan">
                {formData?.total_income ? formatCurrency(formData.total_income) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Pengeluaran">
                {formData?.total_expenses ? formatCurrency(formData.total_expenses) : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {formData?.employmentHistory && Object.keys(formData.employmentHistory).some(key => formData.employmentHistory[key]) && (
            <Col span={24}>
              <Descriptions title="Riwayat Pekerjaan Sebelumnya" bordered size="small">
                <Descriptions.Item label="Jenis Pekerjaan" span={2}>
                  {formData.employmentHistory.employment_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Perusahaan">
                  {formData.employmentHistory.company_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat Perusahaan" span={3}>
                  {formData.employmentHistory.address || "-"}
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
                <Descriptions.Item label="Lama Bekerja" span={2}>
                  {formData.employmentHistory.length_of_work_years ? `${formData.employmentHistory.length_of_work_years} tahun` : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}

          <Col span={24}>
            <Descriptions title="Dokumen" bordered size="small">
              <Descriptions.Item label="KTP" span={3}>
                {formData?.id_card?.length > 0 ? "✓ Sudah diunggah" : "✗ Belum diunggah"}
              </Descriptions.Item>
              <Descriptions.Item label="NPWP" span={3}>
                {formData?.tax_id?.length > 0 ? "✓ Sudah diunggah" : "✗ Belum diunggah"}
              </Descriptions.Item>
              <Descriptions.Item label="Sertifikat Pekerjaan" span={3}>
                {formData?.employment_certificate?.length > 0 ? "✓ Sudah diunggah" : "✗ Belum diunggah"}
              </Descriptions.Item>
              <Descriptions.Item label="Slip Gaji" span={3}>
                {formData?.salary_slip?.length > 0 ? "✓ Sudah diunggah" : "✗ Belum diunggah"}
              </Descriptions.Item>
              {formData?.is_married && (
                <>
                  <Descriptions.Item label="KTP Pasangan" span={3}>
                    {formData?.spouse_id_card?.length > 0 ? "✓ Sudah diunggah" : "✗ Belum diunggah"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Buku Nikah" span={3}>
                    {formData?.marriage_certificate?.length > 0 ? "✓ Sudah diunggah" : "✗ Belum diunggah"}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Col>
        </Row>

        <div className="flex justify-between mt-6">
          <Button size="large" className="px-8" onClick={onPrev}>
            Kembali
          </Button>
          <Button
            type="primary"
            size="large"
            className="px-8"
            onClick={onNext}
          >
            Submit Pengajuan
          </Button>
        </div>
      </Card>
    </div>
  );
}