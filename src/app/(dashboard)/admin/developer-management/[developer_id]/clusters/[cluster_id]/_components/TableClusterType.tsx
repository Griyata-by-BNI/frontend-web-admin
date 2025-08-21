import { useClusterTypes } from "@/services/clusterTypeServices";
import { ClusterType } from "@/types/clusterType";
import { Button, Table, Tooltip } from "antd";
import { Edit, Plus, Trash } from "lucide-react";
import { useMemo } from "react";
import EditClusterTypeModal from "./EditClusterTypeModal";
import DeleteClusterTypeModal from "./DeleteClusterTypeModal";
import TableProperty from "./TableProperty";
import CreatePropertyModal from "./CreatePropertyModal";

interface TableClusterTypeProps {
  clusterId: number;
}

export default function TableClusterType({ clusterId }: TableClusterTypeProps) {
  const { data, isLoading } = useClusterTypes(String(clusterId));

  const tableData = useMemo(
    () => (data ? data.data.clusterTypes : []),
    [data, clusterId]
  );

  const columns = [
    {
      title: "Nama Tipe",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Aksi",
      dataIndex: "action",
      width: 100,
      key: "action",
      render: (_: any, record: ClusterType) => (
        <div className="flex items-center gap-2">
          <EditClusterTypeModal editingRecord={record} />

          <DeleteClusterTypeModal clusterTypeData={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        bordered
        loading={isLoading}
        dataSource={tableData}
        rowKey="id"
        columns={columns}
        className="[&_.ant-table-expanded-row]:bg-gray-200"
        expandable={{
          expandedRowRender: (record: ClusterType) => (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Properti - {record.name}</h4>

                <CreatePropertyModal clusterTypeId={record.id} />
              </div>

              <TableProperty
                clusterTypeId={record.id}
                // onEdit={(property) => {
                //   setEditingProperty(property);
                //   setSelectedClusterTypeId(record.id);
                //   setIsEditPropertyModalOpen(true);
                // }}
                // onDelete={(property) => {
                //   setDeletingProperty(property);
                //   setIsDeletePropertyModalOpen(true);
                // }}
              />
            </div>
          ),
          rowExpandable: (record: ClusterType) => true,
        }}
      />
    </>
  );
}
