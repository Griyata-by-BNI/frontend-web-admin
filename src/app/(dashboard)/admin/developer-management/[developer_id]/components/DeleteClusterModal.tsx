"use client";

import { Modal } from "antd";
import type { Cluster } from "../../types";

interface DeleteClusterModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  clusterData: Cluster | null;
}

export default function DeleteClusterModal({
  open,
  onCancel,
  onConfirm,
  clusterData,
}: DeleteClusterModalProps) {
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
        {clusterData && (
          <>
            <strong>{clusterData.name}</strong>
          </>
        )}?
      </p>
    </Modal>
  );
}