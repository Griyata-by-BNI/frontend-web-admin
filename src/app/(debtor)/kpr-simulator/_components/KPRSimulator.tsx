"use client";
import "@ant-design/v5-patch-for-react-19";
import { Col, Modal, Row, Table } from "antd";
import { useState } from "react";
import interestRateData from "@/data/interest-rate.json";
import { useKPRCalculation } from "../_hooks/useKPRCalculation";
import { useDetailedSchedule } from "../_hooks/useDetailedSchedule";
import { KPRForm } from "./KPRForm";
import { KPRResults } from "./KPRResults";
import { InterestRate, KPRSimulatorProps } from "../_types";

const detailedColumns = [
  { title: "Bulan", dataIndex: "month", key: "month" },
  {
    title: "Angsuran",
    dataIndex: "payment",
    key: "payment",
    render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
  },
  {
    title: "Porsi Pokok",
    dataIndex: "principal",
    key: "principal",
    render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
  },
  {
    title: "Porsi Bunga",
    dataIndex: "interest",
    key: "interest",
    render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
  },
  {
    title: "Sisa Pinjaman",
    dataIndex: "remainingBalance",
    key: "remainingBalance",
    render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
  },
  {
    title: "Bunga",
    dataIndex: "interestRate",
    key: "interestRate",
    render: (value: number) => `${value}%`,
  },
];

export const KPRSimulator = ({
  className = "",
  initialPropertyPrice = 1000000000,
  additionalButton = <></>,
}: KPRSimulatorProps) => {
  const [propertyPrice, setPropertyPrice] =
    useState<number>(initialPropertyPrice);
  const [downPayment, setDownPayment] = useState<number>(200000000);
  const [tenor, setTenor] = useState<number>(15);
  const [selectedInterestRate, setSelectedInterestRate] =
    useState<InterestRate | null>(interestRateData[6] as InterestRate);

  const { monthlyPayment, paymentSchedule, isValidTenor } = useKPRCalculation({
    propertyPrice,
    downPayment,
    tenor,
    selectedRate: selectedInterestRate,
  });

  const {
    showDetailedSchedule,
    detailedSchedule,
    setShowDetailedSchedule,
    generateDetailedSchedule,
  } = useDetailedSchedule();

  const handleShowDetailedSchedule = () => {
    generateDetailedSchedule({
      propertyPrice,
      downPayment,
      tenor,
      selectedRate: selectedInterestRate,
      isValidTenor,
    });
  };

  return (
    <div
      className={`w-full bg-gradient-to-r pt-5 from-primary-tosca to-primary-purple h-max rounded-xl md:rounded-2xl shadow ${className}`}
    >
      <div className="overflow-hidden rounded-xl md:rounded-2xl">
        <Row
          className="bg-white rounded-xl h-full p-4 md:p-8"
          align="stretch"
          gutter={[48, 24]}
        >
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <KPRForm
              propertyPrice={propertyPrice}
              downPayment={downPayment}
              tenor={tenor}
              selectedRate={selectedInterestRate}
              isValidTenor={isValidTenor}
              onPropertyPriceChange={setPropertyPrice}
              onDownPaymentChange={setDownPayment}
              onTenorChange={setTenor}
              onRateChange={setSelectedInterestRate}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <KPRResults
              selectedRate={selectedInterestRate}
              propertyPrice={propertyPrice}
              downPayment={downPayment}
              monthlyPayment={monthlyPayment}
              paymentSchedule={paymentSchedule}
              onShowDetailedSchedule={handleShowDetailedSchedule}
              additionalButton={additionalButton}
            />
          </Col>
        </Row>

        <Modal
          centered
          destroyOnHidden
          title="Detail Angsuran Bulanan"
          open={showDetailedSchedule}
          onCancel={() => setShowDetailedSchedule(false)}
          footer={null}
          width={1000}
        >
          {selectedInterestRate?.floating_note && (
            <p className="text-sm text-gray-500 mb-4">
              Berikut adalah rincian angsuran sampai tahun ke-
              {selectedInterestRate.fixed_duration} :
            </p>
          )}

          <Table
            bordered
            dataSource={detailedSchedule}
            columns={detailedColumns}
            pagination={{ pageSize: 12 }}
            size="small"
            rowKey="key"
            scroll={{ x: 800 }}
          />
        </Modal>
      </div>
    </div>
  );
};
