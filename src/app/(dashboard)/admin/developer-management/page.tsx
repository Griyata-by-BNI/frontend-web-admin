"use client";

import "@ant-design/v5-patch-for-react-19";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Table,
  Tooltip,
} from "antd";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import EditDeveloperModal from "./components/EditDeveloperModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import CreateDeveloperModal from "./components/CreateDeveloperModal";
import type { Developer } from "./types";
import { useRouter } from "next/navigation";

const mockData: Developer[] = [
  {
    id: "1",
    name: "PT Ciputra Development",
    image:
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cluster_count: "15",
    phone_number: "081234567890",
    description: "Leading property developer in Indonesia",
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
  {
    id: "2",
    name: "PT Agung Podomoro Land",
    image:
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cluster_count: "8",
    phone_number: "081234567891",
    description: "Premium residential and commercial developer",
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
];

export default function DeveloperManagementPage() {
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Developer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<Developer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();

  const handleEdit = (record: Developer) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (values: Developer) => {
    console.log("Updated values:", values);
    setIsEditModalOpen(false);
  };

  const handleDelete = (record: Developer) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting:", deletingRecord);
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  const handleCreateSubmit = (values: Omit<Developer, "id">) => {
    console.log("Creating:", values);
    setIsCreateModalOpen(false);
  };

  const filteredData = mockData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Developer) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.image} size={48} />

          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Cluster Count",
      dataIndex: "cluster_count",
      key: "cluster_count",
    },
    { title: "Phone", dataIndex: "phone_number", key: "phone_number" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Developer) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Detail Data">
            <Link href={`/admin/developer-management/${record.id}`}>
              <Button
                icon={<Eye className="w-4 h-4" />}
                onClick={() =>
                  router.push(`/admin/developer-management/${record.id}`)
                }
              />
            </Link>
          </Tooltip>

          <Tooltip title="Edit Data">
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Delete Data">
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
          Developer Management
        </p>

        <Breadcrumb
          items={[
            { title: "Dashboard" },
            {
              title: (
                <p className="text-dark-tosca font-semibold">
                  Developer Management
                </p>
              ),
              href: "/admin/developer-management",
            },
          ]}
        />
      </div>

      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Input.Search
            placeholder="Search by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col flex={"auto"}>
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Data
            </Button>
          </div>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <EditDeveloperModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editingRecord={editingRecord}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        developerData={deletingRecord}
      />

      <CreateDeveloperModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </>
  );
}
