"use client";

import "@ant-design/v5-patch-for-react-19";
import {
  App,
  Breadcrumb,
  Button,
  Col,
  Grid,
  Input,
  Row,
  Table,
  Tabs,
  Tooltip,
  type TableProps,
} from "antd";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { Submission } from "@/types/approval-list";
import {
  useApprovalList,
  useUpdateSubmissionStatus,
} from "@/services/approvalListServices";
import { useRouter } from "next/navigation";

const tabItems = [
  { key: "submitted", label: "Need Approval" },
  { key: "under_review", label: "Under Review" },
  { key: "verified", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function ApprovalListPage() {
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<string>("submitted");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data, isLoading } = useApprovalList({
    status: activeTab,
    pageNumber,
    pageSize,
    search: searchText || undefined,
  });

  const { mutate, isPending } = useUpdateSubmissionStatus();
  const router = useRouter();

  const submissions = useMemo<Submission[]>(
    () => data?.data?.submissions ?? [],
    [data]
  );
  const totalItems = data?.data?.count ?? 0;

  const goToDetail = (id: number) => router.push(`/sales/approval-list/${id}`);

  const handleOpenDetail = (record: Submission) => {
    if (record.status === "submitted") {
      setUpdatingId(record.id);
      mutate(
        { id: record.id, payload: { status: "under_review" } },
        {
          onSuccess: () => {
            goToDetail(record.id);
          },
          onError: () => message.error("Gagal memperbarui status"),
          onSettled: () => setUpdatingId(null),
        }
      );
    } else {
      goToDetail(record.id);
    }
  };

  // Kolom: sembunyikan sebagian di layar kecil; pindahkan detail ke expanded row.
  const columns: TableProps<Submission>["columns"] = useMemo(
    () => [
      {
        title: "Nama Nasabah",
        dataIndex: "customer_name",
        key: "customer_name",
        width: 260,
        fixed: screens.lg ? "left" : undefined,
        render: (text: string) => (
          <span className="truncate block">{text}</span>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 260,
        responsive: ["md"], // tampil mulai md
        render: (text: string) => (
          <span className="truncate block">{text}</span>
        ),
      },
      {
        title: "Tanggal Pengajuan",
        dataIndex: "created_at",
        key: "created_at",
        width: 180,
        responsive: ["lg"], // tampil mulai lg
        render: (date: string) => new Date(date).toLocaleDateString("id-ID"),
      },
      {
        title: "Aksi",
        key: "action",
        align: "center",
        width: 90,
        fixed: screens.lg ? "right" : undefined,
        render: (_: any, record: Submission) => (
          <Tooltip title="Detail">
            <Button
              size="small"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => handleOpenDetail(record)}
              loading={isPending && updatingId === record.id}
            />
          </Tooltip>
        ),
      },
    ],
    [screens.lg, isPending, updatingId]
  );

  const useExpandedRow = !screens.md; // di mobile tampilkan detail di expanded row

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">Approval List</p>
        <Breadcrumb
          items={[
            { title: "Dashboard" },
            {
              title: (
                <p className="text-dark-tosca font-semibold">Approval List</p>
              ),
              href: "/admin/approval-list",
            },
          ]}
        />
      </div>

      {/* Toolbar responsif: Tabs stack di atas Search di mobile */}
      <Row gutter={[12, 0]} className="mb-4" align="middle">
        <Col xs={24} md={16}>
          <Tabs
            activeKey={activeTab}
            onChange={(k) => {
              setActiveTab(k);
              setPageNumber(1);
            }}
            items={tabItems}
          />
        </Col>
        <Col xs={24} md={8}>
          <div className="md:flex md:justify-end">
            <Input.Search
              placeholder="Cari berdasarkan nama atau email"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPageNumber(1);
              }}
              allowClear
            />
          </div>
        </Col>
      </Row>

      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={submissions}
        loading={isLoading}
        rowKey="id"
        // Geser horizontal bila konten melebihi layar
        scroll={{ x: 800 }}
        // expanded row hanya di mobile: tampilkan Email + Tanggal
        expandable={
          useExpandedRow
            ? {
                expandedRowRender: (record) => (
                  <div className="px-2 space-y-1">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium break-all">
                      {record.email || "-"}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Tanggal Pengajuan
                    </div>
                    <div className="font-medium">
                      {new Date(record.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                ),
              }
            : undefined
        }
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalItems,
          showSizeChanger: true,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} dari ${total} data`,
        }}
      />
    </>
  );
}
