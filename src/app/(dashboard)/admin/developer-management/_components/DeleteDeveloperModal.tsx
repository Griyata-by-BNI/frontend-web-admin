"use client";

import { App, Button, Modal, Tooltip, Typography } from "antd";
import { Developer } from "@/types/developer";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useUpdateDeveloper } from "@/services/developerServices";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteDeveloperModalProps {
  developerData: Developer;
}

export default function DeleteDeveloperModal({
  developerData,
}: DeleteDeveloperModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  const isDetailPage = pathname.includes(`${developerData.id}`);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutateAsync, status } = useUpdateDeveloper();

  const handleDeleteConfirm = async () => {
    try {
      const { createdAt, updatedAt, developerPhotoUrl, ...rest } =
        developerData;

      await mutateAsync({
        ...rest,
        isDeleted: true,
      });
      message.success("Developer berhasil dihapus");

      isDetailPage
        ? router.push("/admin/developer-management")
        : queryClient.invalidateQueries({ queryKey: ["developers"] });
    } catch (error) {
      message.error("Gagal menghapus developer");
    }
  };

  return (
    <>
      <Modal
        title={
          <Typography.Title level={5} className="!text-red-500">
            Hapus Data Developer
          </Typography.Title>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        okButtonProps={{ loading: status === "pending" }}
        onOk={handleDeleteConfirm}
        okText="Hapus"
        okType="danger"
        cancelText="Batal"
        classNames={{ footer: "!mt-6" }}
      >
        <p>
          Apakah Anda yakin ingin menghapus data{" "}
          <strong>{developerData?.name}</strong>?
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
