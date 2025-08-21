"use client";

import { usePropertiesByClusterType } from "@/services/propertyServices";
import type { Property } from "@/types/property";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import EditPropertyModal from "./EditPropertyModal";
import DeletePropertyModal from "./DeletePropertyModal";
import DetailPropertyModal from "./DetailPropertyModal";

interface TablePropertyProps {
  clusterTypeId: number;
}

export default function TableProperty({ clusterTypeId }: TablePropertyProps) {
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
      dataIndex: "collateral_address",
      key: "collateral_address",
    },
    {
      title: "Luas Tanah",
      dataIndex: "landArea",
      key: "landArea",
      render: (area: string | null) => (area ? `${area} m²` : "-"),
    },
    {
      title: "Luas Bangunan",
      dataIndex: "buildingArea",
      key: "buildingArea",
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
      render: (_: unknown, record: Property) => (
        <div className="flex gap-1">
          <DetailPropertyModal propertyId={record.propertyId} />

          <EditPropertyModal
            propertyId={record.propertyId}
            clusterTypeId={clusterTypeId}
          />

          <DeletePropertyModal propertyData={record} />
        </div>
      ),
    },
  ];

  const dataSource = useMemo(() => data?.data ?? [], [data]);

  if (isError) {
    return <div className="text-red-500">Gagal memuat data properti.</div>;
  }

  return (
    <Table
      bordered
      loading={isLoading}
      dataSource={dataSource}
      rowKey="propertyId"
      pagination={false}
      columns={columns}
      size="small"
    />
  );
}
