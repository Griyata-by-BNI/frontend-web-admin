"use client";

import { Card, Form, InputNumber, Select, Button, Row, Col } from "antd";
import { useState, useEffect } from "react";
import interestRateData from "@/data/interest-rate.json";

interface LoanInformationFormProps {
  onNext?: (data: any) => void;
  initialValues?: any;
}

export default function LoanInformationForm({
  onNext,
  initialValues,
}: LoanInformationFormProps) {
  const [form] = Form.useForm();
  const [selectedInterestRate, setSelectedInterestRate] = useState<number>();
  const [isFormValid, setIsFormValid] = useState(false);

  const housePrice = 850000000;
  const maxLoanAmount = housePrice * 0.9;
  const minDownPayment = housePrice * 0.1;

  const getMinTenorFromInterestRate = () => {
    if (!selectedInterestRate) return 12;
    const rate = interestRateData.find((r) => r.id === selectedInterestRate);
    return rate ? rate.minimum_tenor * 12 : 12;
  };

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const allFieldsFilled =
      values.loanAmount && values.downPayment && values.tenor && values.interestRate;
    setIsFormValid(allFieldsFilled && !hasErrors);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedInterestRate(initialValues.interestRate);
    }
    checkFormValidity();
  }, [initialValues, selectedInterestRate]);

  const handleNext = () => {
    const values = form.getFieldsValue();
    onNext?.(values);
  };

  return (
    <Card
      title={<p className="text-sm">Informasi Pinjaman</p>}
      className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        onFieldsChange={checkFormValidity}
      >
        <Row gutter={[12, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jumlah Pinjaman"
              name="loanAmount"
              rules={[
                {
                  required: true,
                  message: "Jumlah pinjaman wajib diisi",
                },
                {
                  min: 250000000,
                  type: "number",
                  message: `Jumlah pinjaman minimal Rp 250.000.000`,
                },
                {
                  max: maxLoanAmount,
                  type: "number",
                  message: `Jumlah pinjaman maksimal 90% dari harga rumah (Rp ${maxLoanAmount.toLocaleString(
                    "id-ID"
                  )})`,
                },
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan jumlah pinjaman"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={(value) => {
                  if (!value) return "";
                  const parts = value.toString().split(",");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  return parts.join(",");
                }}
                parser={(value) => {
                  if (!value) return "";
                  return value.replace(/[^0-9,]/g, "").replace(",", ".");
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Uang Muka"
              name="downPayment"
              rules={[
                {
                  required: true,
                  message: "Uang muka wajib diisi",
                },
                {
                  min: minDownPayment,
                  type: "number",
                  message: `Uang muka minimal 10% dari harga rumah (Rp ${minDownPayment.toLocaleString(
                    "id-ID"
                  )})`,
                },
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan uang muka"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={(value) => {
                  if (!value) return "";
                  const parts = value.toString().split(",");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  return parts.join(",");
                }}
                parser={(value) => {
                  if (!value) return "";
                  return value.replace(/[^0-9,]/g, "").replace(",", ".");
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Tenor Peminjaman"
              name="tenor"
              rules={[
                { required: true, message: "Tenor wajib diisi" },
                {
                  validator: (_, value) => {
                    const currentInterestRate =
                      form.getFieldValue("interestRate");
                    if (!currentInterestRate) return Promise.resolve();

                    const rate = interestRateData.find(
                      (r) => r.id === currentInterestRate
                    );
                    const minTenor = rate ? rate.minimum_tenor * 12 : 12;

                    if (value && value < minTenor) {
                      return Promise.reject(
                        new Error(
                          `Tenor minimal ${minTenor} bulan berdasarkan suku bunga yang dipilih`
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan tenor peminjaman"
                suffix={<p className="font-semibold text-dark-tosca">bulan</p>}
                min={getMinTenorFromInterestRate()}
                max={300}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Pilihan Suku Bunga"
              name="interestRate"
              rules={[{ required: true, message: "Suku bunga wajib dipilih" }]}
            >
              <Select
                size="large"
                placeholder="Pilih suku bunga"
                onChange={(value) => {
                  setSelectedInterestRate(value);
                  form.validateFields(["tenor"]);
                }}
                options={interestRateData.map((rate) => ({
                  value: rate.id,
                  label: rate.title,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end mt-6">
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
      </Form>
    </Card>
  );
}
