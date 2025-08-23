"use client";

import { App, Button, Form, Input, Modal, Typography, Upload } from "antd";
import { Plus, UploadCloud } from "lucide-react";
import { useState } from "react";
import { PayloadDeveloper } from "@/types/developer";
import { useCreateDeveloper } from "@/services/developerServices";
import { useQueryClient } from "@tanstack/react-query";
import { createBeforeUploadImage } from "@/utils/uploadValidators";

export default function CreateDeveloperModal() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { mutateAsync, status } = useCreateDeveloper();

  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleSubmit = async (values: any) => {
    try {
      const payload: PayloadDeveloper = {
        name: values.name,
        description: values.description,
        createdBy: 1,
        updatedBy: 1,
        developerPhotoUrl: Array.isArray(values.image)
          ? values.image?.[0]?.originFileObj
          : undefined,
      };
      await mutateAsync(payload);
      message.success("Developer berhasil dibuat");

      form.resetFields();
      setPreviewImage("");
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      setModalOpen(false);
    } catch (error) {
      message.error("Gagal membuat developer");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImage("");
    setModalOpen(false);
  };

  const beforeUpload = createBeforeUploadImage({
    maxMB: 10,
    onInvalid: (m) => message.error(m),
  });

  return (
    <>
      <Button
        type="primary"
        icon={<Plus className="w-4 h-4" />}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Buat Data
      </Button>

      <Modal
        centered
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Buat Data Developer
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okButtonProps={{ loading: status === "pending" }}
        okText="Buat"
        classNames={{
          body: "!pt-2 max-h-[75vh] overflow-y-auto !px-6",
          content: "!p-0",
          header: "!pt-5 !px-6",
          footer: "!pb-5 !px-6",
        }}
      >
        <Form
          form={form}
          disabled={status === "pending"}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nama"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan nama!" }]}
          >
            <Input
              placeholder="Masukkan nama developer"
              maxLength={100}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Gambar"
            className="!mb-3"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Mohon upload gambar!" }]}
          >
            <Upload.Dragger
              maxCount={1}
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              beforeUpload={beforeUpload}
              onChange={(info) => {
                const file = info.fileList[0]?.originFileObj;
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () =>
                    setPreviewImage(reader.result as string);
                  reader.readAsDataURL(file);
                } else {
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
                  <p className="ant-upload-hint">
                    Mendukung upload satu gambar.
                  </p>
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
            <Input.TextArea
              placeholder="Masukkan deskripsi"
              rows={3}
              maxLength={1000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
