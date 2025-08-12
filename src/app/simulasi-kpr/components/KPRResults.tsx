import { Button, Col, Row, Table } from "antd";

interface KPRResultsProps {
  selectedRate: any;
  propertyPrice: number;
  downPayment: number;
  monthlyPayment: number;
  paymentSchedule: any[];
  onShowDetailedSchedule: () => void;
}

export const KPRResults = ({
  selectedRate,
  propertyPrice,
  downPayment,
  monthlyPayment,
  paymentSchedule,
  onShowDetailedSchedule
}: KPRResultsProps) => {
  const columns = [
    { title: "Periode", dataIndex: "period", key: "period" },
    { title: "Suku Bunga", dataIndex: "rate", key: "rate" },
    {
      title: "Angsuran/Bulan",
      dataIndex: "monthlyPayment",
      key: "monthlyPayment",
      render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
    },
  ];

  if (!selectedRate) return null;

  return (
    <div className="p-6 rounded-lg bg-light-tosca h-max w-full">
      <div className="space-y-4">
        <p className="text-primary-black text-lg font-bold">Hasil Simulasi</p>

        {selectedRate.type === "single-fixed" && monthlyPayment > 0 && (
          <div className="overflow-hidden">
            <Row gutter={[4, 4]}>
              <Col span={12}>
                <p className="text-sm text-gray-600">Jumlah Pinjaman</p>
                <p className="text-primary-tosca text-xl font-bold">
                  Rp {(propertyPrice - downPayment).toLocaleString("id-ID")}
                </p>
              </Col>
              <Col span={12}>
                <p className="text-sm text-gray-600">Angsuran per Bulan</p>
                <p className="text-xl font-bold text-primary-tosca">
                  Rp {monthlyPayment.toLocaleString("id-ID")}
                </p>
              </Col>
              <Col span={24}>
                <p className="text-sm text-gray-500 mt-2">*{selectedRate.floating_note}</p>
              </Col>
              <Col span={24}>
                <Button type="primary" onClick={onShowDetailedSchedule} className="mt-4">
                  Lihat Detail Angsuran
                </Button>
              </Col>
            </Row>
          </div>
        )}

        {selectedRate.type === "tiered-fixed" && paymentSchedule.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-3">Tabel Angsuran</p>
            <Table
              dataSource={paymentSchedule}
              columns={columns}
              pagination={false}
              size="small"
              rowKey="key"
            />
            <p className="text-sm text-gray-500 mt-2">*{selectedRate.floating_note}</p>
            <Button type="primary" onClick={onShowDetailedSchedule} className="mt-4">
              Lihat Detail Angsuran
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};