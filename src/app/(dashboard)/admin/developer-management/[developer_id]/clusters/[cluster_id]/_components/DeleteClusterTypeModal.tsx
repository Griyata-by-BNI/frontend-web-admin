import { useDeleteClusterType } from "@/services/clusterTypeServices";
import { ClusterType } from "@/types/clusterType";
import { App, Button, Modal, Tooltip, Typography } from "antd";
import { Trash } from "lucide-react";
import { useState } from "react";

interface DeleteClusterTypeModalProps {
  clusterTypeData: ClusterType;
}

export default function DeleteClusterTypeModal({
  clusterTypeData,
}: DeleteClusterTypeModalProps) {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate, status } = useDeleteClusterType();

  const handleSubmit = () => {
    mutate(String(clusterTypeData.id), {
      onSuccess: () => {
        message.success("Cluster type berhasil dihapus");
        setModalOpen(false);
      },
      onError: (err) => {
        console.error(err);
        message.error("Gagal menghapus cluster type. Silakan coba lagi.");
      },
    });
  };

  return (
    <>
      <Tooltip title="Hapus Data">
        <Button
          icon={<Trash className="w-4 h-4 stroke-red-500" />}
          onClick={() => {
            setModalOpen(true);
          }}
        />
      </Tooltip>

      <Modal
        destroyOnHidden
        title={
          <Typography.Title level={5} className="!text-red-500">
            Hapus Data Cluster Type
          </Typography.Title>
        }
        okButtonProps={{ danger: true, loading: status === "pending" }}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Hapus"
        cancelText="Batal"
      >
        <p>
          Apakah Anda yakin ingin menghapus cluster type{" "}
          <strong>{clusterTypeData?.name}</strong>?
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </>
  );
}
