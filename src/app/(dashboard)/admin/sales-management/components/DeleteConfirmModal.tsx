"use client";

import { Modal } from "antd";
import type { Sales } from "../types";

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
      title="Konfirmasi Hapus"
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
        )}?
      </p>
    </Modal>
  );
}
