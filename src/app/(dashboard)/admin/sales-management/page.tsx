"use client";

import "@ant-design/v5-patch-for-react-19";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import EditSalesModal from "./_components/EditSalesModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import CreateSalesModal from "./_components/CreateSalesModal";
import type { Sales } from "./_types";

const mockData: Sales[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone_number: "081234567890",
    gender: "Male",
    address: "Jakarta",
    target_score: 85,
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone_number: "081234567891",
    gender: "Female",
    address: "Surabaya",
    target_score: 92,
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
];
export default function SalesManagementPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Sales | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<Sales | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEdit = (record: Sales) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (values: Sales) => {
    console.log("Updated values:", values);
    setIsEditModalOpen(false);
  };

  const handleDelete = (record: Sales) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting:", deletingRecord);
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  const handleCreateSubmit = (values: Omit<Sales, "id">) => {
    console.log("Creating:", values);
    setIsCreateModalOpen(false);
  };

  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRegion = !selectedRegion || item.address === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const columns = [
    { title: "Nama", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Telepon", dataIndex: "phone_number", key: "phone_number" },
    { title: "Jenis Kelamin", dataIndex: "gender", key: "gender" },
    { title: "Alamat", dataIndex: "address", key: "address" },
    { title: "Target Skor", dataIndex: "target_score", key: "target_score" },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Sales) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Data">
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Hapus Data">
            <Button
              icon={<Trash className="w-4 h-4 stroke-red-500" />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">
          Sales Management
        </p>

        <Breadcrumb
          items={[
            {
              title: "Dashboard",
            },
            {
              title: (
                <p className="text-dark-tosca font-semibold">
                  Sales Management
                </p>
              ),
              href: "/admin/sales-management",
            },
          ]}
        />
      </div>

      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Input.Search
            placeholder="Cari berdasarkan nama atau email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col span={4}>
          <Select
            placeholder="Filter berdasarkan wilayah"
            value={selectedRegion}
            onChange={setSelectedRegion}
            allowClear
            style={{ width: "100%" }}
          >
            <Select.Option value="Jakarta">Jakarta</Select.Option>
            <Select.Option value="Surabaya">Surabaya</Select.Option>
          </Select>
        </Col>

        <Col flex={"auto"}>
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Buat Data
            </Button>
          </div>
        </Col>
      </Row>

      <Table
        bordered
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <EditSalesModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editingRecord={editingRecord}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        salesData={deletingRecord}
      />

      <CreateSalesModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </>
  );
}
