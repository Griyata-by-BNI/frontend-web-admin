"use client";

import {
  useCreateSales,
  useDeleteSales,
  useSales,
  useUpdateSales,
} from "@/services/salesServices";
import type {
  CreateSalesPayload,
  Sales,
  SortBy,
  SortOrder,
  UpdateSalesPayload,
} from "@/types/sales";
import "@ant-design/v5-patch-for-react-19";
import {
  App,
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { Edit, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { bniRegions } from "./constants";
import CreateSalesModal from "./_components/CreateSalesModal";
import EditSalesModal from "./_components/EditSalesModal";

export default function SalesManagementPage() {
  const { message } = App.useApp();

  const [searchText, setSearchText] = useState("");
  const [regionId, setRegionId] = useState<number | undefined>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("npp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ASC");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Sales | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<Sales | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useSales({
    pageNumber,
    pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: searchText || undefined,
    region_id: regionId,
  });

  const list: Sales[] = useMemo(() => {
    const raw = (data?.data as any) ?? {};
    return raw?.sales ?? [];
  }, [data]);

  const total: number = useMemo(() => {
    const raw = (data?.data as any) ?? {};
    return raw?.pagination?.total ?? list.length;
  }, [data, list]);

  const updateMut = useUpdateSales();
  const deleteMut = useDeleteSales();

  const handleEdit = (record: Sales) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (values: UpdateSalesPayload) => {
    if (!editingRecord) return;
    updateMut.mutate(
      { salesId: editingRecord.id, payload: values },
      {
        onSuccess: () => {
          message.success("Sales berhasil diperbarui");
          setIsEditModalOpen(false);
          setEditingRecord(null);
        },
        onError: () => message.error("Gagal memperbarui sales"),
      }
    );
  };

  const handleDelete = (record: Sales) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingRecord) return;
    deleteMut.mutate(deletingRecord.id, {
      onSuccess: () => {
        message.success("Sales berhasil dihapus");
        setIsDeleteModalOpen(false);
        setDeletingRecord(null);
      },
      onError: () => message.error("Gagal menghapus sales"),
    });
  };

  const columns = [
    { title: "NPP", dataIndex: "npp", key: "npp", sorter: true },
    {
      title: "Performance",
      dataIndex: "performance",
      key: "performance",
      sorter: true,
      render: (v: number) => `${v}%`,
    },
    {
      title: "Monthly Target",
      dataIndex: "target_skor",
      key: "target_skor",
      sorter: true,
    },
    {
      title: "Wilayah",
      dataIndex: "region_id",
      key: "region_id",
      render: (id: number) =>
        bniRegions.find((r: any) => r.value === id)?.label ?? id,
    },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Sales) => (
        <div className="flex items-center gap-2">
          <EditSalesModal record={record} />

          <Tooltip title="Hapus Data">
            <Button
              danger
              icon={<Trash className="w-4 h-4" />}
              onClick={() => handleDelete(record)}
              loading={deleteMut.isPending && deletingRecord?.id === record.id}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">
          Sales Management
        </p>

        <Breadcrumb
          items={[
            { title: "Dashboard" },
            {
              title: (
                <p className="text-dark-tosca font-semibold">
                  Sales Management
                </p>
              ),
              path: "/admin/sales-management",
            },
          ]}
        />
      </div>

      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Input.Search
            placeholder="Cari NPP / User ID"
            value={searchText}
            onChange={(e) => {
              setPageNumber(1);
              setSearchText(e.target.value);
            }}
            allowClear
          />
        </Col>

        <Col span={6}>
          <Select
            placeholder="Filter berdasarkan wilayah"
            value={regionId}
            onChange={(val) => {
              setPageNumber(1);
              setRegionId(val);
            }}
            allowClear
            options={bniRegions as { label: string; value: number }[]}
            style={{ width: "100%" }}
          />
        </Col>

        <Col flex={"auto"}>
          <div className="flex justify-end">
            <CreateSalesModal />
          </div>
        </Col>
      </Row>

      <Table<Sales>
        bordered
        columns={columns as any}
        dataSource={list}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pageNumber,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={(pagination, _filters, sorter) => {
          setPageNumber(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 10);
          if (!Array.isArray(sorter) && sorter?.field) {
            const allowed: SortBy[] = [
              "npp",
              "performance",
              "monthly_target",
              "created_at",
              "updated_at",
            ];
            const nextSortBy = allowed.includes(sorter.field as SortBy)
              ? (sorter.field as SortBy)
              : "npp";
            const nextSortOrder: SortOrder =
              sorter.order === "descend" ? "DESC" : "ASC";
            setSortBy(nextSortBy);
            setSortOrder(nextSortOrder);
          }
        }}
      />

      {/* <EditSalesModal
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleEditSubmit}
        initialValues={editingRecord ?? undefined}
        loading={updateMut.isPending}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        salesData={deletingRecord}
        loading={deleteMut.isPending}
      />

      <CreateSalesModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={createMut.isPending}
      /> */}
    </>
  );
}
