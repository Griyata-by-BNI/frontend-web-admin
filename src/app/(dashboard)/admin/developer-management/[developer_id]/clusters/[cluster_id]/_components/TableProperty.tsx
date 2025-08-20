"use client";

import { Table, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit, Trash } from "lucide-react";
import { useMemo } from "react";
import { usePropertiesByClusterType } from "@/services/propertyServices";
import type { Property } from "@/types/property";

interface TablePropertyProps {
  clusterTypeId: number;
  // onEdit: (record: Property) => void;
  // onDelete: (record: Property) => void;
}

export default function TableProperty({
  clusterTypeId,
}: // onEdit,
// onDelete,
TablePropertyProps) {
  const { data, isLoading, isError } =
    usePropertiesByClusterType(clusterTypeId);

  const columns: ColumnsType<Property> = [
    {
      title: "Nama Properti",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Harga",
      dataIndex: "price",
      key: "price",
      render: (price: string | null) =>
        price ? `Rp ${Number(price).toLocaleString("id-ID")}` : "-",
    },
    {
      title: "Lokasi",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Luas Tanah",
      dataIndex: "land_area",
      key: "land_area",
      render: (area: string | null) => (area ? `${area} m²` : "-"),
    },
    {
      title: "Luas Bangunan",
      dataIndex: "building_area",
      key: "building_area",
      render: (area: string | null) => (area ? `${area} m²` : "-"),
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Aksi",
      key: "action",
      // render: (_: unknown, record: Property) => (
      //   <div className="flex gap-1">
      //     <Tooltip title="Edit Properti">
      //       <Button
      //         size="small"
      //         icon={<Edit className="w-4 h-4" />}
      //         onClick={() => onEdit(record)}
      //       />
      //     </Tooltip>
      //     <Tooltip title="Hapus Properti">
      //       <Button
      //         size="small"
      //         icon={<Trash className="w-4 h-4 stroke-red-500" />}
      //         onClick={() => onDelete(record)}
      //       />
      //     </Tooltip>
      //   </div>
      // ),
    },
  ];

  const dataSource = useMemo(() => data?.data ?? [], [data]);

  if (isError) {
    return <div className="text-red-500">Gagal memuat data properti.</div>;
  }

  return (
    <Table<Property>
      bordered
      loading={isLoading}
      dataSource={dataSource}
      rowKey="id"
      pagination={false}
      columns={columns}
      size="small"
    />
  );
}
