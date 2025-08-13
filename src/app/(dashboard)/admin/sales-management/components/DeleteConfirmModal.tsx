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
      title="Delete Confirmation"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
      classNames={{ footer: "!mt-6" }}
    >
      <p>
        Are you sure you want to delete{" "}
        {salesData && (
          <>
            <strong>{salesData.name}</strong>
          </>
        )}{" "}
        data?
      </p>
    </Modal>
  );
}
