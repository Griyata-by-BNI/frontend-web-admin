"use client";
import "@ant-design/v5-patch-for-react-19";
import { Card, Form, Upload, Button, Row, Col, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import type { UploadProps } from "antd";

interface DocumentUploadFormProps {
  onNext?: (data: any) => void;
  onPrev?: () => void;
  initialValues?: any;
}

export default function DocumentUploadForm({
  onNext,
  onPrev,
  initialValues,
}: DocumentUploadFormProps) {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMarried, setIsMarried] = useState(false);

  const normalizeFileList = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList ?? [];
  };

  const uploadProps: UploadProps = useMemo(
    () => ({
      beforeUpload: (file) => {
        const isValidType =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";
        if (!isValidType) {
          message.error("File harus berformat JPG, PNG, atau PDF!");
          return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error("Ukuran file maksimal 5MB!");
          return false;
        }
        return false; // prevent auto upload
      },
      maxCount: 1,
      className: "[&_.ant-upload]:!w-full",
    }),
    []
  );

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const requiredFields = [
      "id_card",
      "tax_id",
      "employment_certificate",
      "salary_slip",
    ];

    if (isMarried) {
      requiredFields.push("spouse_id_card", "marriage_certificate");
    }

    const allRequiredFieldsFilled = requiredFields.every(
      (field) => Array.isArray(values[field]) && values[field].length > 0
    );

    setIsFormValid(allRequiredFieldsFilled);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setIsMarried(initialValues.is_married || false);
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
        title={<p className="text-sm">Unggah Dokumen</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
      >
        <Row gutter={[24, 12]}>
          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="KTP"
              name="id_card"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[{ required: true, message: "KTP wajib diunggah" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="NPWP"
              name="tax_id"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[{ required: true, message: "NPWP wajib diunggah" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Sertifikat Pekerjaan Saat Ini"
              name="employment_certificate"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[
                {
                  required: true,
                  message: "Sertifikat pekerjaan wajib diunggah",
                },
              ]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Slip Gaji"
              name="salary_slip"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[{ required: true, message: "Slip gaji wajib diunggah" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          {isMarried && (
            <>
              <Col span={24}>
                <Form.Item
                  className="!mb-3 md:!mb-4"
                  label="KTP Pasangan"
                  name="spouse_id_card"
                  valuePropName="fileList"
                  getValueFromEvent={normalizeFileList}
                  rules={[
                    { required: true, message: "KTP pasangan wajib diunggah" },
                  ]}
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className="!w-full">
                      Pilih File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  className="!mb-3 md:!mb-4"
                  label="Buku Nikah"
                  name="marriage_certificate"
                  valuePropName="fileList"
                  getValueFromEvent={normalizeFileList}
                  rules={[
                    { required: true, message: "Buku nikah wajib diunggah" },
                  ]}
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className="!w-full">
                      Pilih File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </>
          )}
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
            disabled={!isFormValid}
          >
            Lanjutkan
          </Button>
        </div>
      </Card>
    </Form>
  );
}
