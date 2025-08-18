"use client";

import "@ant-design/v5-patch-for-react-19";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import { Eye } from "lucide-react";
import { useState } from "react";
import DetailModal from "./_components/DetailModal";
import type { ApprovalItem } from "./_types";

const mockData: ApprovalItem[] = [
  {
    id: 1,
    customer_name: "Ahmad Wijaya",
    customer_phone: "081234567890",
    customer_email: "ahmad@example.com",
    customer_nik: "3201234567890123",
    property_name: "Rumah Minimalis Jakarta",
    property_address: "Jl. Sudirman No. 123, Jakarta Pusat",
    credit_amount: 500000000,
    tenor_months: 120,
    interest_rate: 8.5,
    status: "need_approve",
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
  {
    id: 2,
    customer_name: "Siti Nurhaliza",
    customer_phone: "081234567891",
    customer_email: "siti@example.com",
    customer_nik: "3201234567890124",
    property_name: "Apartemen Surabaya",
    property_address: "Jl. Tunjungan No. 456, Surabaya",
    credit_amount: 750000000,
    tenor_months: 180,
    interest_rate: 9.0,
    status: "approved",
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
];

export default function ApprovalListPage() {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("need_approve");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ApprovalItem | null>(
    null
  );

  const handleDetail = (record: ApprovalItem) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer_nik.includes(searchText);
    const matchesTab = item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const columns = [
    { title: "Nama Nasabah", dataIndex: "customer_name", key: "customer_name" },
    { title: "Nomor HP", dataIndex: "customer_phone", key: "customer_phone" },
    { title: "Email", dataIndex: "customer_email", key: "customer_email" },
    { title: "NIK", dataIndex: "customer_nik", key: "customer_nik" },
    {
      title: "Nama Properti",
      dataIndex: "property_name",
      key: "property_name",
    },
    {
      title: "Alamat Properti",
      dataIndex: "property_address",
      key: "property_address",
    },
    {
      title: "Jumlah Kredit",
      dataIndex: "credit_amount",
      key: "credit_amount",
      render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
    },
    {
      title: "Tenor",
      dataIndex: "tenor_months",
      key: "tenor_months",
      render: (value: number) => `${value} bulan`,
    },
    {
      title: "Suku Bunga",
      dataIndex: "interest_rate",
      key: "interest_rate",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: ApprovalItem) => (
        <Tooltip title="Detail">
          <Button
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handleDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const tabItems = [
    {
      key: "need_approve",
      label: "Need Approve",
    },
    {
      key: "approved",
      label: "Approved",
    },
    {
      key: "rejected",
      label: "Rejected",
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">Approval List</p>

        <Breadcrumb
          items={[
            {
              title: "Dashboard",
            },
            {
              title: (
                <p className="text-dark-tosca font-semibold">Approval List</p>
              ),
              href: "/admin/approval-list",
            },
          ]}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <Input.Search
          placeholder="Cari berdasarkan nama atau NIK"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <DetailModal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </>
  );
}
