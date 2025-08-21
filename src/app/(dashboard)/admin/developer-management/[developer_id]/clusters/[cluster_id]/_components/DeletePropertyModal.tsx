"use client";

import { App, Button, Modal, Tooltip, Typography } from "antd";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useDeleteProperty } from "@/services/propertyServices";
import { Property } from "@/types/property";

interface DeletePropertyModalProps {
  propertyData: Property;
}

export default function DeletePropertyModal({
  propertyData,
}: DeletePropertyModalProps) {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate, isPending } = useDeleteProperty();

  const handleDelete = () => {
    mutate(
      { propertyData: propertyData },
      {
        onSuccess: () => {
          message.success("Berhasil menghapus data property!");
          setModalOpen(false);
        },
        onError: () => {
          message.error("Gagal menghapus data property, silahkan coba lagi!");
        },
      }
    );
  };

  return (
    <>
      <Tooltip title="Hapus Properti">
        <Button
          size="small"
          onClick={() => setModalOpen(true)}
          icon={<Trash className="w-4 h-4 stroke-red-500" />}
        />

        <Modal
          title={
            <Typography.Title level={5} className="!text-red-500">
              Hapus Data Properti
            </Typography.Title>
          }
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleDelete}
          okText="Hapus"
          cancelText="Batal"
          okButtonProps={{ danger: true, loading: isPending }}
          classNames={{
            content: "!p-0",
            header: "!pt-5 !px-6",
            body: "!px-6",
            footer: "!pb-5 !px-6",
          }}
        >
          <p>
            Apakah Anda yakin ingin menghapus properti{" "}
            <strong>{propertyData?.name}</strong>?
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </Modal>
      </Tooltip>
    </>
  );
}
