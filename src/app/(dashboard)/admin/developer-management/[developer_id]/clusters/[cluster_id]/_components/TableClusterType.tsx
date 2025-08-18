import { Table, Input, Button, Row, Col, Tooltip } from "antd";
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { mockClusterTypeData, mockPropertyData } from "../../../../_constants";
import type { ClusterType } from "../../../../_types";
import CreateClusterTypeModal from "./CreateClusterTypeModal";
import EditClusterTypeModal from "./EditClusterTypeModal";
import DeleteClusterTypeModal from "./DeleteClusterTypeModal";
import CreatePropertyModal from "./CreatePropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import DeletePropertyModal from "./DeletePropertyModal";
import TableProperty from "./TableProperty";
import type { Property } from "../../../../_types";

interface TableClusterTypeProps {
  clusterId: number;
}

export default function TableClusterType({ clusterId }: TableClusterTypeProps) {
  const [searchText, setSearchText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] =
    useState(false);
  const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false);
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] =
    useState(false);
  const [selectedClusterTypeId, setSelectedClusterTypeId] = useState<
    number | null
  >(null);
  const [editingRecord, setEditingRecord] = useState<ClusterType | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(
    null
  );
  const [deletingRecord, setDeletingRecord] = useState<ClusterType | null>(
    null
  );

  const columns = [
    {
      title: "Nama Tipe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Jumlah Properti",
      key: "propertyCount",
      render: (_: any, record: ClusterType) => {
        const count = mockPropertyData.filter(
          (p) => p.clusterTypeId === record.id
        ).length;
        return count;
      },
    },
    {
      title: "Aksi",
      dataIndex: "action",
      width: 100,
      key: "action",
      render: (_: any, record: ClusterType) => (
        <div className="flex items-center gap-2">
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

  const filteredData = mockClusterTypeData
    .filter((type) => type.clusterId === clusterId)
    .filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

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

        <Col flex="auto">
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
        dataSource={filteredData}
        rowKey="id"
        columns={columns}
        className="[&_.ant-table-expanded-row]:bg-gray-100"
        expandable={{
          expandedRowRender: (record: ClusterType) => (
            <div className="">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Properti - {record.name}</h4>

                <Button
                  size="small"
                  icon={<Plus className="w-3 h-3" />}
                  onClick={() => {
                    setSelectedClusterTypeId(record.id);
                    setIsCreatePropertyModalOpen(true);
                  }}
                >
                  Tambah Data
                </Button>
              </div>

              <Table
                borderedProperty
                clusterTypeId={record.id}
                onEdit={(property) => {
                  setEditingProperty(property);
                  setSelectedClusterTypeId(record.id);
                  setIsEditPropertyModalOpen(true);
                }}
                onDelete={(property) => {
                  setDeletingProperty(property);
                  setIsDeletePropertyModalOpen(true);
                }}
              />
            </div>
          ),
          rowExpandable: (record: ClusterType) => {
            const count = mockPropertyData.filter(
              (p) => p.clusterTypeId === record.id
            ).length;
            return count > 0;
          },
        }}
      />

      <CreateClusterTypeModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={(values) => {
          console.log("New cluster type:", values);
          setIsCreateModalOpen(false);
        }}
      />

      <EditClusterTypeModal
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={(values) => {
          console.log("Updated cluster type:", values);
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        editingRecord={editingRecord}
      />

      <DeleteClusterTypeModal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingRecord(null);
        }}
        onConfirm={() => {
          console.log("Deleted cluster type:", deletingRecord);
          setIsDeleteModalOpen(false);
          setDeletingRecord(null);
        }}
        clusterTypeData={deletingRecord}
      />

      <CreatePropertyModal
        open={isCreatePropertyModalOpen}
        onCancel={() => {
          setIsCreatePropertyModalOpen(false);
          setSelectedClusterTypeId(null);
        }}
        onSubmit={(values) => {
          console.log("New property:", values);
          setIsCreatePropertyModalOpen(false);
          setSelectedClusterTypeId(null);
        }}
        clusterTypeId={selectedClusterTypeId || 0}
      />

      <EditPropertyModal
        open={isEditPropertyModalOpen}
        onCancel={() => {
          setIsEditPropertyModalOpen(false);
          setEditingProperty(null);
          setSelectedClusterTypeId(null);
        }}
        onSubmit={(values) => {
          console.log("Updated property:", values);
          setIsEditPropertyModalOpen(false);
          setEditingProperty(null);
          setSelectedClusterTypeId(null);
        }}
        editingRecord={editingProperty}
        clusterTypeId={selectedClusterTypeId || 0}
      />

      <DeletePropertyModal
        open={isDeletePropertyModalOpen}
        onCancel={() => {
          setIsDeletePropertyModalOpen(false);
          setDeletingProperty(null);
        }}
        onConfirm={() => {
          console.log("Deleted property:", deletingProperty);
          setIsDeletePropertyModalOpen(false);
          setDeletingProperty(null);
        }}
        propertyData={deletingProperty}
      />
    </>
  );
}
