import { Table, Button, Tooltip } from "antd";
import { Edit, Trash } from "lucide-react";
import { mockPropertyData } from "../../../../_constants";
import type { Property } from "../../../../_types";

interface TablePropertyProps {
  clusterTypeId: number;
  onEdit: (record: Property) => void;
  onDelete: (record: Property) => void;
}

export default function TableProperty({
  clusterTypeId,
  onEdit,
  onDelete,
}: TablePropertyProps) {
  const columns = [
    {
      title: "Nama Properti",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Harga",
      dataIndex: "price",
      key: "price",
      render: (price: string) =>
        `Rp ${parseInt(price).toLocaleString("id-ID")}`,
    },
    {
      title: "Lokasi",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Luas Tanah",
      dataIndex: "landArea",
      key: "landArea",
      render: (area: string) => `${area} m²`,
    },
    {
      title: "Luas Bangunan",
      dataIndex: "buildingArea",
      key: "buildingArea",
      render: (area: string) => `${area} m²`,
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: any, record: Property) => (
        <div className="flex gap-1">
          <Tooltip title="Edit Properti">
            <Button
              size="small"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus Properti">
            <Button
              size="small"
              icon={<Trash className="w-4 h-4 stroke-red-500" />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const filteredData = mockPropertyData.filter(
    (property) => property.clusterTypeId === clusterTypeId
  );

  return (
    <Table
      bordered
      dataSource={filteredData}
      rowKey="id"
      pagination={false}
      columns={columns}
      size="small"
    />
  );
}
