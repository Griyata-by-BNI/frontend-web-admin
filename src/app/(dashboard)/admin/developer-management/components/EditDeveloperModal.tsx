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
          Edit Developer Data
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Update"
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
          label="Name"
          className="!mb-2"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          className="!mb-2"
          rules={[{ required: true, message: "Please upload an image!" }]}
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
                  Click or drag file to replace current image
                </p>
              </div>
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Upload new image to replace current one.
                </p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>

        <Form.Item
          name="cluster_count"
          label="Cluster Count"
          className="!mb-2"
          rules={[{ required: true, message: "Please input cluster count!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          className="!mb-2"
          rules={[{ required: true, message: "Please input phone number!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="!mb-2"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
