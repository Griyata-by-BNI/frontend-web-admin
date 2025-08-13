"use client";

import { Modal } from "antd";
import type { Developer } from "../types";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  developerData: Developer | null;
}

export default function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
  developerData,
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
        {developerData && (
          <>
            <strong>{developerData.name}</strong>
          </>
        )}{" "}
        data?
      </p>
    </Modal>
  );
}