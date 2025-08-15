import { Modal, Typography } from "antd";
import type { ClusterType } from "../../../../types";

interface DeleteClusterTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  clusterTypeData: ClusterType | null;
}

export default function DeleteClusterTypeModal({
  open,
  onCancel,
  onConfirm,
  clusterTypeData,
}: DeleteClusterTypeModalProps) {
  return (
    <Modal
      title={
        <Typography.Title level={5} className="!text-red-500">
          Hapus Data Cluster Type
        </Typography.Title>
      }
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Hapus"
      cancelText="Batal"
      okButtonProps={{ danger: true }}
    >
      <p>
        Apakah Anda yakin ingin menghapus cluster type{" "}
        <strong>{clusterTypeData?.name}</strong>?
      </p>

      <p className="text-gray-500 text-sm mt-2">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </Modal>
  );
}
