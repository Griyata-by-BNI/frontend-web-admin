import { Alert, Button, Col, Row, Table, theme } from "antd";
import { InterestRate } from "../_types";
import React, { useMemo } from "react";
import Link from "next/link";

const { useToken } = theme;

interface KPRResultsProps {
  selectedRate: InterestRate | null;
  propertyPrice: number;
  downPayment: number;
  monthlyPayment: number;
  paymentSchedule: any[];
  onShowDetailedSchedule: () => void;
  additionalButton?: React.ReactNode;
  tenor: number; // ✅ baru
}

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

export const KPRResults = ({
  selectedRate,
  propertyPrice,
  downPayment,
  monthlyPayment,
  paymentSchedule,
  onShowDetailedSchedule,
  additionalButton,
  tenor, // ✅ baru
}: KPRResultsProps) => {
  const { token } = useToken();
  if (!selectedRate) return null;

  // ======== Perhitungan aman (tidak “tabrakan” nilai) ========
  const loanAmount = useMemo(
    () => Math.max(0, Math.round(propertyPrice - downPayment)),
    [propertyPrice, downPayment]
  );

  const totalInstallment = useMemo(() => {
    if (selectedRate.type === "single-fixed") {
      const months = Math.max(0, Math.floor(tenor * 12));
      return months > 0 ? Math.round(monthlyPayment * months) : null;
    }

    // tiered-fixed: coba hitung dari schedule jika ada 'months' / 'duration'
    if (Array.isArray(paymentSchedule) && paymentSchedule.length > 0) {
      const sum = paymentSchedule.reduce((acc: number, row: any) => {
        const m = Number(row?.months ?? row?.duration ?? 0);
        const mp = Number(row?.monthlyPayment ?? 0);
        return acc + (m > 0 ? m * mp : 0);
      }, 0);
      return sum > 0 ? Math.round(sum) : null;
    }

    return null;
  }, [selectedRate.type, tenor, monthlyPayment, paymentSchedule]);

  const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div className="p-4 md:p-6 rounded-lg bg-light-tosca h-max w-full">
      <div className="space-y-4">
        <p className="text-primary-black text-lg font-bold">Hasil Simulasi</p>

        {selectedRate.type === "single-fixed" && (
          <div className="overflow-hidden">
            {monthlyPayment > 0 ? (
              <Row gutter={[4, 4]}>
                {/* Jumlah Pinjaman */}
                <Col xs={24} sm={12} md={12} className="min-w-0">
                  <p className="text-sm text-gray-600">Jumlah Pinjaman</p>
                  <p
                    className="text-primary-tosca text-xl font-bold break-words md:truncate"
                    title={fmt(loanAmount)}
                  >
                    {fmt(loanAmount)}
                  </p>
                </Col>

                {/* Angsuran per Bulan (ditaruh penuh 1 baris supaya tidak desak-desakan) */}
                <Col xs={24} sm={12} md={12} className="min-w-0">
                  <p className="text-sm text-gray-600">Angsuran per Bulan</p>
                  <p
                    className="text-xl font-bold text-primary-tosca break-words md:truncate"
                    title={fmt(monthlyPayment)}
                  >
                    {fmt(monthlyPayment)}
                  </p>
                </Col>

                {/* Catatan suku bunga */}
                {selectedRate.floating_note && (
                  <Col span={24}>
                    <p className="text-sm text-gray-500 mt-2">
                      *{selectedRate.floating_note}
                    </p>
                  </Col>
                )}

                {/* Aksi */}
                <Col span={24}>
                  <Button
                    type="primary"
                    onClick={onShowDetailedSchedule}
                    className="mt-4 w-full"
                  >
                    Lihat Detail Angsuran
                  </Button>
                </Col>

                {additionalButton && (
                  <Col span={24} className="mt-2">
                    {additionalButton}
                  </Col>
                )}

                <Col span={24}>
                  <Link href="/">
                    <p className="text-sm text-dark-tosca/75 underline text-center">
                      Syarat & Ketentuan
                    </p>
                  </Link>
                </Col>
              </Row>
            ) : (
              <Alert
                message="Tidak dapat menghitung simulasi"
                description="Pastikan semua data telah diisi dengan benar dan tenor sesuai dengan ketentuan suku bunga yang dipilih."
                type="warning"
                showIcon
              />
            )}
          </div>
        )}

        {selectedRate.type === "tiered-fixed" && (
          <div>
            {paymentSchedule.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-3">Tabel Angsuran</p>

                <Table
                  bordered
                  dataSource={paymentSchedule}
                  columns={columns}
                  pagination={false}
                  size="small"
                  rowKey="key"
                />

                {selectedRate.floating_note && (
                  <p className="text-sm text-gray-500 mt-2">
                    *{selectedRate.floating_note}
                  </p>
                )}

                <Button
                  type="primary"
                  onClick={onShowDetailedSchedule}
                  className="mt-4 w-full"
                >
                  Lihat Detail Angsuran
                </Button>

                {additionalButton && <>{additionalButton}</>}
              </>
            ) : (
              <Alert
                message={
                  <p
                    style={{ color: token.colorWarning }}
                    className="font-bold"
                  >
                    Tidak dapat menghitung simulasi
                  </p>
                }
                description="Pastikan semua data telah diisi dengan benar dan tenor sesuai dengan ketentuan suku bunga yang dipilih."
                type="warning"
                showIcon
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
