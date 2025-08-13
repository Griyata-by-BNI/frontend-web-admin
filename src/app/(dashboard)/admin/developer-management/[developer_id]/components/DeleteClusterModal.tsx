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
        {clusterData && (
          <>
            <strong>{clusterData.name}</strong>
          </>
        )}{" "}
        data?
      </p>
    </Modal>
  );
}