import { Button, Col, Input, Row, Table, Tooltip } from "antd";
import { mockClusterData } from "../../constants";
import type { Cluster } from "../../types";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useState } from "react";
import CreateClusterModal from "./CreateClusterModal";
import EditClusterModal from "./EditClusterModal";
import DeleteClusterModal from "./DeleteClusterModal";

export default function TableCluster({}) {
  const [searchText, setSearchText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Cluster | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<Cluster | null>(null);

  const filteredData = mockClusterData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Cluster) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Detail Data">
            <Button icon={<Eye className="w-4 h-4" />} />
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
          <Tooltip title="Delete Data">
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
