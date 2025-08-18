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
  message,
} from "antd";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateDeveloperModal from "./_components/CreateDeveloperModal";
import DeleteDeveloperModal from "./_components/DeleteDeveloperModal";
import EditDeveloperModal from "./_components/EditDeveloperModal";
import { Developer } from "@/types/developer";
import {
  useGetDevelopers,
  useDeleteDeveloper,
} from "@/services/developerServices";

export default function DeveloperManagementPage() {
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Developer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<Developer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();
  const { data: developers = [], isLoading, refetch } = useGetDevelopers();
  const deleteMutation = useDeleteDeveloper();

  const handleEdit = (record: Developer) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setIsEditModalOpen(false);
    refetch();
  };

  const handleDelete = (record: Developer) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingRecord) {
      try {
        await deleteMutation.mutateAsync({
          id: deletingRecord.id,
          updatedBy: 1,
        });
        message.success("Developer berhasil dihapus");
        refetch();
      } catch (error) {
        message.error("Gagal menghapus developer");
      }
    }
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  const handleCreateSubmit = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const filteredData = developers?.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Developer) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.developerPhotoUrl} size={48} />
          <span>{text}</span>
        </div>
      ),
    },
    { title: "Deskripsi", dataIndex: "description", key: "description" },
    {
      title: "Aksi",
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
            placeholder="Cari berdasarkan nama"
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
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <EditDeveloperModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editingRecord={editingRecord}
      />

      <DeleteDeveloperModal
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
