"use client";

import { useCreateClusterType } from "@/services/clusterTypeServices";
import { Modal, Form, Input, Button, App } from "antd";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CreateClusterTypeModal() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { cluster_id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate, status } = useCreateClusterType();

  const handleSubmit = (values: any) => {
    mutate(
      {
        name: values.name,
        clusterId: parseInt(cluster_id as string),
        description: "",
      },
      {
        onSuccess: () => {
          message.success("Cluster type berhasil dibuat");
          setModalOpen(false);
          form.resetFields();
        },
        onError: (err) => {
          console.error(err);
          message.error("Gagal membuat cluster type. Silakan coba lagi.");
        },
      }
    );
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        icon={<Plus className="w-4 h-4" />}
        onClick={() => setModalOpen(true)}
      >
        Tambah Cluster Type
      </Button>

      <Modal
        destroyOnHidden
        title="Buat Cluster Type"
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okButtonProps={{ loading: status === "pending" }}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Nama Cluster Type"
            rules={[
              { required: true, message: "Nama cluster type wajib diisi" },
            ]}
          >
            <Input
              maxLength={100}
              showCount
              placeholder="Masukkan nama cluster type"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
