import { Button, Col, Input, Row, Table, Tag, Tooltip } from "antd";
import { mockClusterData } from "../../constants";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useState } from "react";
import CreateClusterModal from "./CreateClusterModal";
import EditClusterModal from "./EditClusterModal";
import DeleteClusterModal from "./DeleteClusterModal";
import { useRouter, useParams } from "next/navigation";
import { Cluster } from "@/types/clusters";

export default function TableCluster({}) {
  const router = useRouter();
  const { developer_id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Cluster | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<Cluster | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(
    new Set()
  );

  const filteredData = mockClusterData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Telepon",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
      render: (description: string, record: Cluster) => {
        const isExpanded = expandedDescriptions.has(record.id);
        const shouldTruncate = description && description.length > 100;

        if (!description) return "-";

        return (
          <div>
            <span>
              {shouldTruncate && !isExpanded
                ? `${description.substring(0, 100)}...`
                : description}
            </span>

            {shouldTruncate && (
              <Button
                type="text"
                size="small"
                className="!p-0 !m-0 h-auto !text-gray-400"
                onClick={() => {
                  const newExpanded = new Set(expandedDescriptions);
                  if (isExpanded) {
                    newExpanded.delete(record.id);
                  } else {
                    newExpanded.add(record.id);
                  }
                  setExpandedDescriptions(newExpanded);
                }}
              >
                {isExpanded ? "View Less" : "View More"}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Fasilitas Bersama",
      dataIndex: "facilities",
      key: "facilities",
      width: "400px",
      render: (facilities: string) => (
        <>
          {facilities ? (
            <div className="overflow-hidden">
              <Row gutter={[0, 4]}>
                {facilities.split(", ").map((item, index) => (
                  <Col key={index}>
                    <Tag>{item}</Tag>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Cluster) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Detail Data">
            <Button
              icon={<Eye className="w-4 h-4" />}
              onClick={() =>
                router.push(
                  `/admin/developer-management/${developer_id}/clusters/${record.id}`
                )
              }
            />
          </Tooltip>

          <Tooltip title="Edit Data">
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => {
                setEditingRecord(record);
                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Hapus Data">
            <Button
              icon={<Trash className="w-4 h-4 stroke-red-500" />}
              onClick={() => {
                setDeletingRecord(record);
                setIsDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
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
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <CreateClusterModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={(values) => {
          console.log("New cluster:", values);
          setIsCreateModalOpen(false);
        }}
      />

      <EditClusterModal
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={(values) => {
          console.log("Updated cluster:", values);
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        editingRecord={editingRecord}
      />

      <DeleteClusterModal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingRecord(null);
        }}
        onConfirm={() => {
          console.log("Deleted cluster:", deletingRecord);
          setIsDeleteModalOpen(false);
          setDeletingRecord(null);
        }}
        clusterData={deletingRecord}
      />
    </>
  );
}
