import { Modal } from "antd";
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
      title="Hapus Cluster Type"
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
    </Modal>
  );
}