"use client";

import { Cluster, DetailCluster } from "@/types/cluster";
import { Button, Modal, Tooltip, Typography } from "antd";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DeleteClusterModalProps {
  dataCluster: Cluster | DetailCluster;
}

export default function DeleteClusterModal({
  dataCluster,
}: DeleteClusterModalProps) {
  const pathname = usePathname();
  const isDetailPage = pathname.includes("/clusters");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Modal
        title={
          <Typography.Title level={5} className="!text-red-500">
            Hapus Data Cluster
          </Typography.Title>
        }
        open={modalOpen}
        okButtonProps={{ type: "primary" }}
        // onOk={onConfirm}
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
