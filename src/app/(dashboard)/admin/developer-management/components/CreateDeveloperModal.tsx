"use client";

import { Form, Input, Modal, Typography, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { Developer } from "../types";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

interface CreateDeveloperModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Developer, "id">) => void;
}

export default function CreateDeveloperModal({
  open,
  onCancel,
  onSubmit,
}: CreateDeveloperModalProps) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
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
          Create Developer Data
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Create"
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
          <Input placeholder="Enter developer name" />
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
                  Click or drag file to replace current image
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center w-full">
                  <UploadCloud className="w-10 h-10 stroke-primary-tosca" />
                </div>
                <p className="text-gray-700 text-md mt-2">
                  Click or drag file to upload image
                </p>
                <p className="ant-upload-hint">
                  Support for a single image upload.
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
          <Input placeholder="Enter cluster count" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          className="!mb-2"
          rules={[
            { required: true, message: "Please input phone number!" },
            { min: 10, message: "Phone number must be at least 10 digits!" },
          ]}
        >
          <Input placeholder="081234567890" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="!mb-2"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
