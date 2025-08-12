"use client";

import { Col, Modal, Row, Table } from "antd";
import { useState } from "react";
import interestRateData from "@/data/interest-rate.json";
import { useKPRCalculation } from "./hooks/useKPRCalculation";
import { useDetailedSchedule } from "./hooks/useDetailedSchedule";
import { KPRForm } from "./components/KPRForm";
import { KPRResults } from "./components/KPRResults";

export default function SimulasiKPR() {
  const [propertyPrice, setPropertyPrice] = useState<number>(1000000000);
  const [downPayment, setDownPayment] = useState<number>(200000000);
  const [tenor, setTenor] = useState<number>(15);
  const [selectedRate, setSelectedRate] = useState<any>(interestRateData[6]);

  const { monthlyPayment, paymentSchedule, isValidTenor } = useKPRCalculation({
    propertyPrice,
    downPayment,
    tenor,
    selectedRate
  });

  const { showDetailedSchedule, detailedSchedule, setShowDetailedSchedule, generateDetailedSchedule } = useDetailedSchedule();

  const handleShowDetailedSchedule = () => {
    generateDetailedSchedule({ propertyPrice, downPayment, tenor, selectedRate, isValidTenor });
  };

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

  return (
    <div className="w-full bg-gradient-to-r pt-5 from-primary-tosca to-primary-purple h-max rounded-xl shadow">
      <div className="overflow-hidden rounded-xl">
        <Row className="bg-white rounded-xl h-full p-12" align="stretch" gutter={[48, 48]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <KPRForm
              propertyPrice={propertyPrice}
              downPayment={downPayment}
              tenor={tenor}
              selectedRate={selectedRate}
              isValidTenor={isValidTenor}
              onPropertyPriceChange={setPropertyPrice}
              onDownPaymentChange={setDownPayment}
              onTenorChange={setTenor}
              onRateChange={setSelectedRate}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <KPRResults
              selectedRate={selectedRate}
              propertyPrice={propertyPrice}
              downPayment={downPayment}
              monthlyPayment={monthlyPayment}
              paymentSchedule={paymentSchedule}
              onShowDetailedSchedule={handleShowDetailedSchedule}
            />
          </Col>
        </Row>

        <Modal
          title="Detail Angsuran Bulanan"
          open={showDetailedSchedule}
          onCancel={() => setShowDetailedSchedule(false)}
          footer={null}
          width={1000}
        >
          <Table
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
}