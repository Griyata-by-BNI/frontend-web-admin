import { Cluster, DetailCluster } from "@/types/cluster";
import { Button, Col, Input, Row, Table, Tag, Tooltip, Typography } from "antd";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useClustersByDeveloper } from "@/services/clusterServices";
import CreateClusterModal from "./CreateClusterModal";
import DeleteClusterModal from "./DeleteClusterModal";
import EditClusterModal from "./EditClusterModal";

export default function TableCluster({}) {
  const router = useRouter();
  const { developer_id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingClusterId, setEditingClusterId] = useState<string | null>(null);

  const { data: clustersData, isLoading } = useClustersByDeveloper(
    developer_id as string
  );

  const filteredData = (clustersData?.data?.clusters || []).filter(
    (item: Cluster) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Alamat",
      dataIndex: "address",
      width: 300,
      key: "address",
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Typography.Paragraph
          ellipsis={{
            expandable: true,
            rows: 2,
            symbol: () => "Lihat Detail",
          }}
        >
          {text}
        </Typography.Paragraph>
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
                setEditingClusterId(record.id.toString());
                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          <DeleteClusterModal dataCluster={record} />
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
        bordered
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />

      <CreateClusterModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={(values) => {
          console.log("New cluster:", values);
          setIsCreateModalOpen(false);
        }}
      />
    </>
  );
}
