"use client";

import { Col, Progress, Row, Steps, Collapse } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import dayjs from "dayjs";
import LoanInformationForm from "./_components/LoanInformationForm";
import DebtorInformationForm from "./_components/DebtorInformationForm";
import SpouseInformationForm from "./_components/SpouseInformationForm";
import EmploymentInformationForm from "./_components/EmploymentInformationForm";
import DocumentUploadForm from "./_components/DocumentUploadForm";
import SummaryForm from "./_components/SummaryForm";

export default function KprApplyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Loan Information
    loanAmount: 500000000,
    downPayment: 85000000,
    tenor: 120,
    interestRate: 1,

    // Debtor Information
    full_name: "John Doe",
    nik: "1234567890123456",
    tax_id_number: "123456789012345",
    mother_maiden_name: "Jane Smith",
    phone_number: "081234567890",
    email: "john.doe@email.com",
    place_of_birth: "Jakarta",
    birth_date: dayjs("1990-01-01"),
    education: "S1",
    gender: "L",
    residence_status: "sendiri",
    id_card_address: "Jl. Contoh No. 123, Jakarta Selatan",
    same_as_ktp: true,
    domicile_address: "Jl. Contoh No. 123, Jakarta Selatan",
    emergency_contact_name: "Jane Doe",
    emergency_contact_address: "Jl. Darurat No. 456, Jakarta Utara",
    emergency_contact_home_phone: "0212345678",
    emergency_contact_mobile_phone: "081987654321",
    emergency_contact_relationship: "Saudara",

    // Spouse Information
    is_married: true,
    spouse_information: {
      full_name: "Jane Doe",
      gender: "P",
      birth_date: dayjs("1992-05-15"),
      nationality: "Indonesia",
      education: "S1",
      nik: "6543210987654321",
      tax_id_number: "543210987654321",
      phone_number: "081234567891",
      email: "jane.doe@email.com",
      id_card_address: "Jl. Contoh No. 123, Jakarta Selatan",
    },

    // Employment Information
    employment_type: "Karyawan Swasta",
    company_name: "PT. Contoh Teknologi",
    address: "Jl. Sudirman No. 789, Jakarta Pusat",
    company_phone_number: "0213456789",
    job_title: "Software Engineer",
    position: "Manager",
    industry_type: "Teknologi Informasi",
    length_of_work_years: 5,
    basic_salary: 15000000,
    other_income: 2000000,
    total_income: 17000000,
    total_expenses: 8000000,

    // Employment History
    employmentHistory: {
      employment_type: "Karyawan Swasta",
      company_name: "PT. Sebelumnya",
      address: "Jl. Lama No. 321, Jakarta Barat",
      phone_number: "0214567890",
      job_title: "Junior Developer",
      position: "Staff",
      industry_type: "Teknologi Informasi",
      length_of_work_years: 3,
    },

    // Document Upload (mock file objects)
    id_card: [{ uid: "1", name: "ktp.jpg", status: "done" }],
    tax_id: [{ uid: "2", name: "npwp.pdf", status: "done" }],
    employment_certificate: [
      { uid: "3", name: "sertifikat_kerja.pdf", status: "done" },
    ],
    salary_slip: [{ uid: "4", name: "slip_gaji.pdf", status: "done" }],
    spouse_id_card: [{ uid: "5", name: "ktp_pasangan.jpg", status: "done" }],
    marriage_certificate: [
      { uid: "6", name: "buku_nikah.pdf", status: "done" },
    ],
  });

  const handleNext = (stepData?: any) => {
    if (stepData) {
      setFormData((prev) => ({ ...prev, ...stepData }));
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const items = [
    { title: "Informasi Pengajuan" },
    { title: "Informasi Nasabah" },
    { title: "Informasi Pasangan" },
    { title: "Informasi Pekerjaan" },
    { title: "Unggah Dokumen" },
    { title: "Ringkasan" },
  ];

  return (
    <>
      <Steps
        labelPlacement="vertical"
        items={items}
        current={currentStep}
        className="!hidden md:!flex [&_.ant-steps-item-title]:!leading-6"
      />

      <div className="h-20 p-4 bg-gradient-to-r from-primary-tosca to-dark-tosca rounded-lg md:hidden">
        <p className="text-white font-bold">{items[currentStep]?.title}</p>

        <Progress
          percent={((currentStep + 1) / 6) * 100}
          strokeColor="#ffffff"
          className="[&_.ant-progress-text]:!text-white"
        />
      </div>

      {[0, 5].includes(currentStep) && (
        <Row className="mt-4 md:mt-8">
          <Col span={24}>
            <Collapse
              defaultActiveKey={["1"]}
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? 180 : 0} />
              )}
              className="bg-white"
              items={[
                {
                  key: "1",
                  label: (
                    <span className="font-semibold text-gray-700">
                      Informasi Properti
                    </span>
                  ),
                  children: (
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={8} md={6}>
                        <Image
                          width={200}
                          height={150}
                          alt="home-image"
                          className="rounded-md object-cover w-full"
                          src="https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        />
                      </Col>

                      <Col xs={24} sm={16} md={18}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Nama Cluster
                            </p>
                            <p className="font-semibold text-gray-800">
                              Emerald Residence
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Nama Properti
                            </p>
                            <p className="font-semibold text-gray-800">
                              Rumah Emerald A1
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">Alamat</p>
                            <p className="font-semibold text-gray-800">
                              Jl. Emerald Raya No. 15, Serpong, Tangerang
                              Selatan
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">Harga</p>
                            <p className="font-bold text-primary-tosca text-lg">
                              Rp 850.000.000
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      )}

      <Row className="mt-6">
        <Col span={24}>
          {currentStep === 0 && (
            <LoanInformationForm onNext={handleNext} initialValues={formData} />
          )}

          {currentStep === 1 && (
            <DebtorInformationForm
              onNext={handleNext}
              onPrev={handlePrev}
              initialValues={formData}
            />
          )}

          {currentStep === 2 && (
            <SpouseInformationForm
              onNext={handleNext}
              onPrev={handlePrev}
              initialValues={formData}
            />
          )}

          {currentStep === 3 && (
            <EmploymentInformationForm
              onNext={handleNext}
              onPrev={handlePrev}
              initialValues={formData}
            />
          )}

          {currentStep === 4 && (
            <DocumentUploadForm
              onNext={handleNext}
              onPrev={handlePrev}
              initialValues={formData}
            />
          )}

          {currentStep === 5 && (
            <SummaryForm
              onNext={handleNext}
              onPrev={handlePrev}
              formData={formData}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
