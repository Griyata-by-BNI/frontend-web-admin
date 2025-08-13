"use client";

import { Button, Form, Input, Modal, Select, Typography, Upload } from "antd";
import { Upload as UploadIcon, X } from "lucide-react";
import { useState } from "react";
import type { Cluster } from "../../types";
import { FacitiliesData } from "../../constants";

interface CreateClusterModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Cluster, "id" | "created_at" | "updated_at">) => void;
}

export default function CreateClusterModal({
  open,
  onCancel,
  onSubmit,
}: CreateClusterModalProps) {
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
    setPreviewImages([]);
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImages([]);
    onCancel();
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Create Cluster Data
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
          <Input placeholder="Enter cluster name" />
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
          name="latitude"
          label="Latitude"
          className="!mb-2"
          rules={[{ required: true, message: "Please input latitude!" }]}
        >
          <Input placeholder="Enter latitude" type="number" step="any" />
        </Form.Item>

        <Form.Item
          name="longitude"
          label="Longitude"
          className="!mb-2"
          rules={[{ required: true, message: "Please input longitude!" }]}
        >
          <Input placeholder="Enter longitude" type="number" step="any" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="!mb-2"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={3} />
        </Form.Item>

        <Form.Item
          name="facilities"
          label="Facilities"
          className="!mb-2"
          rules={[{ required: true, message: "Please select facilities!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select facilities"
            options={FacitiliesData.map((facility) => ({
              label: facility,
              value: facility,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="images"
          label="Images"
          className="!mb-2"
          rules={[
            { required: true, message: "Please upload at least one image!" },
          ]}
          valuePropName="fileList"
        >
          <Upload
            multiple
            beforeUpload={() => false}
            showUploadList={false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const images: string[] = [];
                let processedCount = 0;

                info.fileList.forEach((file) => {
                  if (file.originFileObj) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      images.push(reader.result as string);
                      processedCount++;

                      if (processedCount === info.fileList.length) {
                        form.setFieldValue("images", images);
                        setPreviewImages(images);
                      }
                    };
                    reader.readAsDataURL(file.originFileObj);
                  }
                });
              } else {
                form.setFieldValue("images", []);
                setPreviewImages([]);
              }
            }}
          >
            <Button icon={<UploadIcon className="w-4 h-4" />}>
              Upload Images
            </Button>
          </Upload>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />

                  <Button
                    shape="circle"
                    size="small"
                    icon={<X className="w-4 h-4" />}
                    className="!absolute top-1 right-1 !z-[9999999]"
                    onClick={() => {
                      const newImages = previewImages.filter(
                        (_, i) => i !== index
                      );
                      setPreviewImages(newImages);
                      form.setFieldValue("images", newImages);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
