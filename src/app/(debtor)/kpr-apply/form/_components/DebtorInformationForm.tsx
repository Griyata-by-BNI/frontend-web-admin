"use client";
import "@ant-design/v5-patch-for-react-19";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useState, useEffect } from "react";

interface DebtorInformationFormProps {
  onNext?: (data: any) => void;
  onPrev?: () => void;
  initialValues?: any;
}

export default function DebtorInformationForm({
  onNext,
  onPrev,
  initialValues,
}: DebtorInformationFormProps) {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const educationOptions = [
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA/SMK" },
    { value: "D3", label: "Diploma 3" },
    { value: "S1", label: "Sarjana (S1)" },
    { value: "S2", label: "Magister (S2)" },
    { value: "S3", label: "Doktor (S3)" },
  ];

  const genderOptions = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];

  const residenceStatusOptions = [
    { value: "sendiri", label: "Milik Sendiri" },
    { value: "orang_tua", label: "Milik Orang Tua" },
    { value: "sewa", label: "Sewa/Kontrak" },
  ];

  const relationshipOptions = [
    { value: "Orang Tua", label: "Orang Tua" },
    { value: "Saudara", label: "Saudara" },
    { value: "Pasangan", label: "Pasangan" },
  ];

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const requiredFields = [
      "full_name",
      "nik",
      "mother_maiden_name",
      "phone_number",
      "email",
      "place_of_birth",
      "birth_date",

      "education",
      "gender",
      "residence_status",
      "id_card_address",
      "emergency_contact_name",
      "emergency_contact_address",
      "emergency_contact_home_phone",
      "emergency_contact_mobile_phone",
      "emergency_contact_relationship",
    ];

    // Add domicile_address to required fields only if same_as_ktp is not checked
    if (!values.same_as_ktp) {
      requiredFields.push("domicile_address");
    }

    const allRequiredFieldsFilled = requiredFields.every(
      (field) => values[field]
    );

    setIsFormValid(allRequiredFieldsFilled && !hasErrors);
  };

  console.log(form.getFieldsValue());

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      checkFormValidity();
    }
  }, [initialValues]);

  const handleNext = () => {
    const values = form.getFieldsValue();
    onNext?.(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="mt-4"
      onFieldsChange={checkFormValidity}
    >
      <Card
        title={<p className="text-sm">Informasi Nasabah</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
      >
        <Row gutter={[24, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nama Lengkap"
              name="full_name"
              rules={[{ required: true, message: "Nama lengkap wajib diisi" }]}
            >
              <Input size="large" placeholder="Masukkan nama lengkap" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="NIK"
              name="nik"
              rules={[
                { required: true, message: "NIK wajib diisi" },
                { len: 16, message: "NIK harus 16 digit" },
              ]}
            >
              <Input size="large" placeholder="Masukkan NIK" maxLength={16} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="NPWP"
              name="tax_id_number"
              rules={[
                { required: true, message: "NPWP wajib diisi" },
                { len: 15, message: "NPWP harus 15 digit" },
              ]}
            >
              <Input
                size="large"
                placeholder="Masukkan NPWP (opsional)"
                maxLength={15}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nama Lengkap Ibu Kandung"
              name="mother_maiden_name"
              rules={[
                { required: true, message: "Nama ibu kandung wajib diisi" },
              ]}
            >
              <Input size="large" placeholder="Masukkan nama ibu kandung" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nomor Handphone"
              name="phone_number"
              rules={[
                { required: true, message: "Nomor handphone wajib diisi" },
                {
                  pattern: /^08[0-9]{8,11}$/,
                  message: "Format nomor handphone tidak valid",
                },
              ]}
            >
              <Input size="large" placeholder="Masukkan nomor handphone" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email wajib diisi" },
                { type: "email", message: "Format email tidak valid" },
              ]}
            >
              <Input size="large" placeholder="Masukkan email" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Tempat Lahir"
              name="place_of_birth"
              rules={[{ required: true, message: "Tempat lahir wajib diisi" }]}
            >
              <Input size="large" placeholder="Masukkan tempat lahir" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Tanggal Lahir"
              name="birth_date"
              rules={[{ required: true, message: "Tanggal lahir wajib diisi" }]}
            >
              <DatePicker
                size="large"
                placeholder="Pilih tanggal lahir"
                className="!w-full"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Pendidikan Terakhir"
              name="education"
              rules={[
                {
                  required: true,
                  message: "Pendidikan terakhir wajib dipilih",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih pendidikan terakhir"
                options={educationOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jenis Kelamin"
              name="gender"
              rules={[
                { required: true, message: "Jenis kelamin wajib dipilih" },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih jenis kelamin"
                options={genderOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Status Tempat Tinggal"
              name="residence_status"
              rules={[
                {
                  required: true,
                  message: "Status tempat tinggal wajib dipilih",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih status tempat tinggal"
                options={residenceStatusOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Alamat Sesuai KTP"
              name="id_card_address"
              rules={[
                { required: true, message: "Alamat sesuai KTP wajib diisi" },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder="Masukkan alamat sesuai KTP"
                rows={3}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              className="!mb-2"
              name="same_as_ktp"
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    const ktpAddress = form.getFieldValue("id_card_address");
                    form.setFieldValue("domicile_address", ktpAddress);
                  } else {
                    form.setFieldValue("domicile_address", "");
                  }
                  setTimeout(checkFormValidity, 0);
                }}
              >
                Alamat domisili sama dengan alamat KTP
              </Checkbox>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.same_as_ktp !== curr.same_as_ktp
              }
            >
              {({ getFieldValue }) => {
                const sameAsKtp = getFieldValue("same_as_ktp");

                if (!sameAsKtp) {
                  return (
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Alamat Sesuai Domisili"
                      name="domicile_address"
                      rules={[
                        {
                          required: true,
                          message: "Alamat sesuai domisili wajib diisi",
                        },
                      ]}
                    >
                      <Input.TextArea
                        size="large"
                        placeholder="Masukkan alamat sesuai domisili"
                        rows={3}
                      />
                    </Form.Item>
                  );
                }
              }}
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        title={<p className="text-sm">Kontak Darurat</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9] !mt-6"
      >
        <Row gutter={[24, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nama Lengkap"
              name="emergency_contact_name"
              rules={[{ required: true, message: "Nama lengkap wajib diisi" }]}
            >
              <Input size="large" placeholder="Masukkan nama lengkap" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Hubungan"
              name="emergency_contact_relationship"
              rules={[{ required: true, message: "Hubungan wajib dipilih" }]}
            >
              <Select
                size="large"
                placeholder="Pilih hubungan"
                options={relationshipOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nomor Telepon Rumah"
              name="emergency_contact_home_phone"
              rules={[
                { required: true, message: "Nomor telepon rumah wajib diisi" },
              ]}
            >
              <Input size="large" placeholder="Masukkan nomor telepon rumah" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nomor Handphone"
              name="emergency_contact_mobile_phone"
              rules={[
                { required: true, message: "Nomor handphone wajib diisi" },
                {
                  pattern: /^08[0-9]{8,11}$/,
                  message: "Format nomor handphone tidak valid",
                },
              ]}
            >
              <Input size="large" placeholder="Masukkan nomor handphone" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Alamat"
              name="emergency_contact_address"
              rules={[{ required: true, message: "Alamat wajib diisi" }]}
            >
              <Input.TextArea
                size="large"
                placeholder="Masukkan alamat"
                rows={3}
              />
            </Form.Item>
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
            onClick={handleNext}
            // disabled={!isFormValid}
          >
            Lanjutkan
          </Button>
        </div>
      </Card>
    </Form>
  );
}
