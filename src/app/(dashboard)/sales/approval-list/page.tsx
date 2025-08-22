"use client";

import "@ant-design/v5-patch-for-react-19";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Table,
  Tabs,
  Tooltip,
  App,
} from "antd";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { Submission } from "@/types/approval-list";
import { useApprovalList } from "@/services/approvalListServices";
import { useRouter } from "next/navigation";
import { useUpdateSubmissionStatus } from "@/services/approvalListServices";

const tabItems = [
  { key: "need_approval", label: "Need Approval" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function ApprovalListPage() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<string>("need_approval");
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
  const totalItems = data?.data?.pagination?.totalItems ?? 0;

  const goToDetail = (id: number) => router.push(`/sales/approval-list/${id}`);

  const handleOpenDetail = (record: Submission) => {
    if (record.status === "need_approval") {
      setUpdatingId(record.id);
      mutate(
        { id: record.id, payload: { status: "under_review" } },
        {
          onSuccess: () => {
            // message.success("Status diperbarui ke Under Review");
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

  const columns = [
    { title: "Nama Nasabah", dataIndex: "customer_name", key: "customer_name" },
    { title: "Nomor HP", dataIndex: "phone_number", key: "phone_number" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "NIK", dataIndex: "nik", key: "nik" },
    {
      title: "Nama Properti",
      dataIndex: "property_name",
      key: "property_name",
    },
    {
      title: "Alamat Properti",
      dataIndex: "property_address",
      key: "property_address",
    },
    {
      title: "Jumlah Kredit",
      dataIndex: "loan_amount",
      key: "loan_amount",
      render: (v: string) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(Number(v)),
    },
    { title: "Tenor", dataIndex: "tenor", key: "tenor" },
    { title: "Suku Bunga", dataIndex: "interest_rate", key: "interest_rate" },
    {
      title: "Aksi",
      key: "action",
      fixed: "right",
      align: "center",
      width: 80,
      render: (_: any, record: Submission) => (
        <Tooltip title="Detail">
          <Button
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handleOpenDetail(record)}
            loading={isPending && updatingId === record.id}
          />
        </Tooltip>
      ),
    },
  ];

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

      <div className="flex justify-between items-center mb-4">
        <Tabs
          activeKey={activeTab}
          onChange={(k) => {
            setActiveTab(k);
            setPageNumber(1);
          }}
          items={tabItems}
        />
        <Input.Search
          placeholder="Cari berdasarkan nama atau NIK"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPageNumber(1);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        bordered
        columns={columns as any}
        dataSource={submissions}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalItems,
          showSizeChanger: true,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
        }}
        scroll={{ x: 1200 }}
      />
    </>
  );
}
