"use client";

import { Form, Input, Modal, Typography, Upload } from "antd";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import type { Developer } from "../_types";

interface EditDeveloperModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Developer) => void;
  editingRecord: Developer | null;
}

export default function EditDeveloperModal({
  open,
  onCancel,
  onSubmit,
  editingRecord,
}: EditDeveloperModalProps) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (editingRecord && open) {
      const formData = { ...editingRecord };
      // Convert image string to empty fileList for Upload component
      (formData as any).image = [];
      form.setFieldsValue(formData);
      setPreviewImage(editingRecord.image || "");
    }
  }, [editingRecord, form, open]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
    setPreviewImage("");
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
          Edit Data Developer
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Perbarui"
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
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Gambar"
          className="!mb-3"
          valuePropName="fileList"
          rules={[{ required: true, message: "Mohon upload gambar!" }]}
        >
          <Upload.Dragger
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result as string;
                    form.setFieldValue("image", result);
                    setPreviewImage(result);
                  };
                  reader.readAsDataURL(file);
                }
              } else {
                form.setFieldValue("image", "");
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
          name="cluster_count"
          label="Jumlah Cluster"
          className="!mb-3"
          rules={[
            { required: true, message: "Mohon masukkan jumlah cluster!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Nomor Telepon"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan nomor telepon!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
