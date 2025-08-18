"use client";

import { Form, Input, Modal, Typography, Upload, message } from "antd";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { PayloadDeveloper } from "@/types/developer";
import { useCreateDeveloper } from "@/services/developerServices";

interface CreateDeveloperModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function CreateDeveloperModal({
  open,
  onCancel,
  onSubmit,
}: CreateDeveloperModalProps) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");
  const createMutation = useCreateDeveloper();

  const handleSubmit = async (values: any) => {
    try {
      const payload: PayloadDeveloper = {
        name: values.name,
        description: values.description,
        createdBy: 1,
        updatedBy: 1,
        developerPhotoUrl: values.image
      };
      await createMutation.mutateAsync(payload);
      message.success('Developer berhasil dibuat');
      onSubmit();
      form.resetFields();
      setPreviewImage("");
    } catch (error) {
      message.error('Gagal membuat developer');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImage("");
    onCancel();
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Buat Data Developer
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Buat"
      classNames={{
        body: "!pt-2 max-h-[75vh] overflow-y-auto !px-6",
        content: "!p-0",
        header: "!pt-5 !px-6",
        footer: "!pb-5 !px-6",
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nama"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan nama!" }]}
        >
          <Input placeholder="Masukkan nama developer" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Gambar"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon upload gambar!" }]}
        >
          <Upload.Dragger
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                if (file) {
                  form.setFieldValue("image", file);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              } else {
                form.setFieldValue("image", null);
                setPreviewImage("");
              }
            }}
          >
            {previewImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-72 aspect-video object-contain rounded mb-2"
                />
                <p className="text-gray-500">
                  Klik atau seret file untuk mengganti gambar
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center w-full">
                  <UploadCloud className="w-10 h-10 stroke-primary-tosca" />
                </div>
                <p className="text-gray-700 text-md mt-2">
                  Klik atau seret file untuk upload gambar
                </p>
                <p className="ant-upload-hint">Mendukung upload satu gambar.</p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>



        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea placeholder="Masukkan deskripsi" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
