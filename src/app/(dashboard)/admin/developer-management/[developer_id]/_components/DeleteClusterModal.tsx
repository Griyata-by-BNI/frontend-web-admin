"use client";

import { Cluster } from "@/types/cluster";
import { Modal, Typography } from "antd";

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
      title={
        <Typography.Title level={5} className="!text-red-500">
          Hapus Data Cluster
        </Typography.Title>
      }
      open={open}
      okButtonProps={{ type: "primary" }}
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
        )}
        ?
      </p>

      <p className="text-gray-500 text-sm mt-2">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </Modal>
  );
}
