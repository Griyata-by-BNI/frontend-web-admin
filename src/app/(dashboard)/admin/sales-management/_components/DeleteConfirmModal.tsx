"use client";

import { Modal, Typography } from "antd";
import type { Sales } from "../_types";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  salesData: Sales | null;
}

export default function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
  salesData,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      title={
        <Typography.Title level={5} className="!text-red-500">
          Hapus Data Sales
        </Typography.Title>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Hapus"
      okType="danger"
      cancelText="Batal"
      classNames={{ footer: "!mt-6" }}
    >
      <p>
        Apakah Anda yakin ingin menghapus data{" "}
        {salesData && (
          <>
            <strong>{salesData.name}</strong>
          </>
        )}
        ?
      </p>

      <p className="text-gray-500 text-sm mt-2">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </Modal>
  );
}
