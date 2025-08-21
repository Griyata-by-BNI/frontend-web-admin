"use client";

import { useDeleteCluster } from "@/services";
import { Cluster, DetailCluster } from "@/types/cluster";
import { useQueryClient } from "@tanstack/react-query";
import { App, Button, Modal, Tooltip, Typography } from "antd";
import { Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteClusterModalProps {
  dataCluster: Cluster | DetailCluster;
}

export default function DeleteClusterModal({
  dataCluster,
}: DeleteClusterModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { developer_id } = useParams();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const isDetailPage = pathname.includes("/clusters");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { mutate, status } = useDeleteCluster();

  const handleDeleteConfirm = async () => {
    if (!dataCluster) return;

    mutate(
      { id: String(dataCluster.id) },
      {
        onSuccess: () => {
          setModalOpen(false);
          message.success("Cluster berhasil dihapus");

          isDetailPage
            ? router.push(`/admin/developer-management/${developer_id}`)
            : queryClient.invalidateQueries({ queryKey: ["clusters"] });
        },
        onError: (err) => {
          console.log(err);
          message.error("Gagal menghapus cluster");
        },
      }
    );
  };

  return (
    <>
      <Modal
        zIndex={9999999}
        title={
          <Typography.Title level={5} className="!text-red-500">
            Hapus Data Cluster
          </Typography.Title>
        }
        open={modalOpen}
        okButtonProps={{ type: "primary", loading: status === "pending" }}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setModalOpen(false);
        }}
        okText="Hapus"
        okType="danger"
        cancelText="Batal"
        classNames={{ footer: "!mt-6" }}
      >
        <p>
          Apakah Anda yakin ingin menghapus data{" "}
          {dataCluster && dataCluster.name && (
            <>
              <strong>{dataCluster.name}</strong>
            </>
          )}
          ?
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

      {isDetailPage ? (
        <Button
          icon={<Trash className="w-4 h-4 stroke-red-500" />}
          className="w-max"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Hapus
        </Button>
      ) : (
        <Tooltip title="Hapus Data">
          <Button
            icon={<Trash className="w-4 h-4 stroke-red-500" />}
            onClick={() => {
              setModalOpen(true);
            }}
          />
        </Tooltip>
      )}
    </>
  );
}
