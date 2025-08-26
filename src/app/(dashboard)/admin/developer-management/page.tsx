"use client";

import "@ant-design/v5-patch-for-react-19";

import {
  Breadcrumb,
  Button,
  Col,
  Grid,
  Input,
  Row,
  Table,
  Tooltip,
  Typography,
  type TableProps,
} from "antd";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
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
  const screens = Grid.useBreakpoint();

  const { data, isLoading } = useGetDevelopers(
    pageSize,
    currentPage,
    debouncedSearch
  );

  const developers = data?.data.developers || [];
  const totalItems = data?.pagination.totalItems || 0;

  const useExpandedRow = !screens.lg;

  const columns: TableProps<Developer>["columns"] = useMemo(
    () => [
      // === Kolom index ===
      {
        title: "No",
        dataIndex: "__index",
        key: "__index",
        width: 70,
        align: "center",
        fixed: screens.lg ? "left" : undefined,
        render: (_: unknown, __: Developer, idx: number) =>
          (currentPage - 1) * pageSize + idx + 1,
      },
      {
        title: "Nama",
        dataIndex: "name",
        key: "name",
        fixed: screens.lg ? "left" : undefined,
        width: 280,
        render: (text: string, record: Developer) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
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
            <span className="truncate">{text}</span>
          </div>
        ),
      },
      {
        title: "Deskripsi",
        dataIndex: "description",
        key: "description",
        width: 420,
        responsive: ["lg"],
        render: (text: string) => (
          <Typography.Paragraph
            className="mb-0"
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
        title: "Terakhir Diperbarui",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 180,
        responsive: ["sm"],
        render: (date: string) => new Date(date).toLocaleDateString("id-ID"),
      },
      {
        title: "Aksi",
        dataIndex: "action",
        key: "action",
        width: 120,
        align: "center",
        fixed: screens.lg ? "right" : undefined,
        render: (_: any, record: Developer) => (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Detail Data">
              <Link href={`/admin/developer-management/${record.id}`}>
                <Button
                  size="small"
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
    ],
    [router, screens.lg, currentPage, pageSize]
  );

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
            },
          ]}
        />
      </div>

      {/* toolbar responsif */}
      <Row gutter={[16, 16]} className="mb-4" align="middle">
        <Col xs={24} md={12} lg={8}>
          <Input.Search
            placeholder="Cari berdasarkan nama"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>

        <Col xs={24} md={12} lg={16}>
          <div className="flex md:justify-end">
            <CreateDeveloperModal />
          </div>
        </Col>
      </Row>

      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={developers}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 900 }}
        expandable={
          useExpandedRow
            ? {
                expandedRowRender: (record) => (
                  <div className="px-2 lg:hidden">
                    <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
                    <Typography.Paragraph
                      className="mb-0"
                      ellipsis={{
                        rows: 4,
                        expandable: true,
                        symbol: () => "Selengkapnya",
                      }}
                    >
                      {record.description || "-"}
                    </Typography.Paragraph>
                  </div>
                ),
                rowExpandable: (record) => Boolean(record.description),
              }
            : undefined
        }
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} dari ${total} data`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
        }}
      />
    </>
  );
}
