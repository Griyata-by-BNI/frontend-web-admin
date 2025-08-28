"use client";

import { App, Button, Modal, Tooltip, Typography } from "antd";
import { useDeleteSales } from "@/services/salesServices";
import { useState } from "react";
import { Trash } from "lucide-react";
import { Sales } from "@/types/sales";

interface DeleteConfirmModalProps {
  salesData: Sales | null;
}

export default function DeleteConfirmModal({
  salesData,
}: DeleteConfirmModalProps) {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const deleteMut = useDeleteSales();

  const handleDeleteConfirm = () => {
    if (!salesData) return;
    deleteMut.mutate(salesData.id, {
      onSuccess: () => {
        message.success("Sales berhasil dihapus");
        setModalOpen(false);
      },
      onError: () => message.error("Gagal menghapus sales"),
    });
  };

  return (
    <>
      <Tooltip title="Hapus Data">
        <Button
          danger
          icon={<Trash className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
          loading={deleteMut.isPending}
        />
      </Tooltip>

      <Modal
        title={
          <Typography.Title level={5} className="!text-red-500">
            Hapus Data Sales
          </Typography.Title>
        }
        open={modalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setModalOpen(false)}
        okText="Hapus"
        okType="danger"
        cancelText="Batal"
        classNames={{ footer: "!mt-6" }}
      >
        <p>
          Apakah Anda yakin ingin menghapus data{" "}
          {salesData && (
            <>
              <strong>{salesData.nama || salesData.npp}</strong>
            </>
          )}
          ?
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </>
  );
}
