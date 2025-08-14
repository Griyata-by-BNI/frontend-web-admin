"use client";

import { Modal, Typography } from "antd";
import type { Developer } from "../types";

interface DeleteDeveloperModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  developerData: Developer | null;
}

export default function DeleteDeveloperModal({
  open,
  onCancel,
  onConfirm,
  developerData,
}: DeleteDeveloperModalProps) {
  return (
    <Modal
      title={
        <Typography.Title level={5} className="!text-red-500">
          Hapus Data Developer
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
        {developerData && (
          <>
            <strong>{developerData.name}</strong>
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
