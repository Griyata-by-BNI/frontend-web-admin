import { Table } from "antd";
import { mockPropertyData } from "../../../../constants";

interface TablePropertyProps {
  clusterTypeId: number;
}

export default function TableProperty({ clusterTypeId }: TablePropertyProps) {
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
      render: (price: string) => `Rp ${parseInt(price).toLocaleString('id-ID')}`,
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
  ];

  const filteredData = mockPropertyData.filter(property => property.clusterTypeId === clusterTypeId);

  return (
    <Table
      dataSource={filteredData}
      rowKey="id"
      pagination={false}
      columns={columns}
      size="small"
    />
  );
}