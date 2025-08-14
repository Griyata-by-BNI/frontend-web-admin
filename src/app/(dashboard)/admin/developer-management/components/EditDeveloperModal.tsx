"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Typography, Upload } from "antd";
import { useEffect } from "react";
import type { Developer } from "../types";

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

  useEffect(() => {
    if (editingRecord && open) {
      form.setFieldsValue(editingRecord);
    }
  }, [editingRecord, form, open]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
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
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan nama!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Gambar"
          className="!mb-2"
          valuePropName="fileList"
          rules={[{ required: true, message: "Mohon upload gambar!" }]}
        >
          <Upload.Dragger
            maxCount={1}
            beforeUpload={() => false}
            fileList={[]}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    form.setFieldValue("image", reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              } else {
                form.setFieldValue("image", "");
              }
            }}
          >
            {editingRecord?.image ? (
              <div className="flex flex-col items-center">
                <img
                  src={editingRecord.image}
                  alt="Current profile"
                  className="w-72 aspect-video object-contain rounded mb-2"
                />

                <p className="text-gray-500">
                  Klik atau seret file untuk mengganti gambar
                </p>
              </div>
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Klik atau seret file ke area ini untuk upload
                </p>
                <p className="ant-upload-hint">
                  Upload gambar baru untuk mengganti yang lama.
                </p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>

        <Form.Item
          name="cluster_count"
          label="Jumlah Cluster"
          className="!mb-2"
          rules={[
            { required: true, message: "Mohon masukkan jumlah cluster!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Nomor Telepon"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan nomor telepon!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
