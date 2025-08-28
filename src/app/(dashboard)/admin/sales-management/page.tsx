"use client";

import { useSales } from "@/services/salesServices";
import type { Sales, SortBy, SortOrder } from "@/types/sales";
import { useDebounce } from "@/utils/useDebounce";
import "@ant-design/v5-patch-for-react-19";
import { App, Breadcrumb, Col, Input, Row, Select, Table } from "antd";
import { useMemo, useState } from "react";
import CreateSalesModal from "./_components/CreateSalesModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import EditSalesModal from "./_components/EditSalesModal";
import { bniRegions } from "./constants";

export default function SalesManagementPage() {
  const { message } = App.useApp();

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [regionId, setRegionId] = useState<number | undefined>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("npp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ASC");

  const { data, isLoading } = useSales({
    pageNumber,
    pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: debouncedSearchText || undefined,
    region_id: regionId,
  });

  const list: Sales[] = useMemo(() => {
    const raw = (data?.data as any) ?? {};
    return raw?.sales ?? [];
  }, [data]);

  const total: number = useMemo(() => {
    const raw = (data?.data as any) ?? {};
    return raw?.pagination?.totalItems ?? list.length;
  }, [data, list]);

  const columns = [
    {
      title: "No",
      dataIndex: "__index",
      key: "__index",
      width: 70,
      align: "center",
      render: (_: unknown, __: any, idx: number) =>
        (pageNumber - 1) * pageSize + idx + 1,
    },
    { title: "NPP", dataIndex: "npp", key: "npp" },
    {
      title: "Nama Lengkap",
      dataIndex: "nama",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    // {
    //   title: "Performance",
    //   dataIndex: "performance",
    //   key: "performance",
    //   sorter: true,
    //   render: (v: number | null) => (v ? `${v}%` : "-"),
    // },
    {
      title: "Monthly Target",
      dataIndex: "target_skor",
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

          <DeleteConfirmModal salesData={record} />
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
