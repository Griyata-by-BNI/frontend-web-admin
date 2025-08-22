"use client";

import "@ant-design/v5-patch-for-react-19";

import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Developer } from "@/types/developer";
import { useDebounce } from "@/utils/useDebounce";
import { useGetDevelopers } from "@/services/developerServices";
import EditDeveloperModal from "./_components/EditDeveloperModal";
import CreateDeveloperModal from "./_components/CreateDeveloperModal";
import DeleteDeveloperModal from "./_components/DeleteDeveloperModal";

export default function DeveloperManagementPage() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebounce(searchText, 500);
  const router = useRouter();

  const { data, isLoading } = useGetDevelopers(
    pageSize,
    currentPage,
    debouncedSearch
  );

  const developers = data?.data.developers || [];
  const totalItems = data?.pagination.totalItems || 0;

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Developer) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-full overflow-hidden">
            <Image
              key={`${record.developerPhotoUrl}-${record.updatedAt}`}
              src={`${record.developerPhotoUrl}?t=${new Date(
                record.updatedAt
              ).getTime()}`}
              width={48}
              height={48}
              alt={record.name}
              className="w-full h-full object-cover"
            />
          </div>

          <span>{text}</span>
        </div>
      ),
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
            symbol: (expanded) => {
              return "Lihat Detail";
            },
          }}
        >
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Terakhir Diperbarui",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString("id-ID"),
    },
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

          <EditDeveloperModal developerData={record} />

          <DeleteDeveloperModal developerData={record} />
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
              path: "/admin/developer-management",
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
            <CreateDeveloperModal />
          </div>
        </Col>
      </Row>

      <Table
        bordered
        columns={columns}
        dataSource={developers}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
        }}
      />
    </>
  );
}
