"use client";

import { Modal } from "antd";
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
        {developerData && (
          <>
            <strong>{developerData.name}</strong>
          </>
        )}
        ?
      </p>
    </Modal>
  );
}
