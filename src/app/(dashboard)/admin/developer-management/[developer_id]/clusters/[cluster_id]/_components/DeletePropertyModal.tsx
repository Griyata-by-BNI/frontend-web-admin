"use client";

import { Modal, Typography } from "antd";
import type { Property } from "../../../../_types";

interface DeletePropertyModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  propertyData: Property | null;
}

export default function DeletePropertyModal({
  open,
  onCancel,
  onConfirm,
  propertyData,
}: DeletePropertyModalProps) {
  return (
    <Modal
      title={
        <Typography.Title level={5} className="!text-red-500">
          Hapus Data Properti
        </Typography.Title>
      }
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Hapus"
      cancelText="Batal"
      okButtonProps={{ danger: true }}
      classNames={{
        content: "!p-0",
        header: "!pt-5 !px-6",
        body: "!px-6",
        footer: "!pb-5 !px-6",
      }}
    >
      <p>
        Apakah Anda yakin ingin menghapus properti{" "}
        <strong>{propertyData?.name}</strong>?
      </p>

      <p className="text-gray-500 text-sm mt-2">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </Modal>
  );
}
