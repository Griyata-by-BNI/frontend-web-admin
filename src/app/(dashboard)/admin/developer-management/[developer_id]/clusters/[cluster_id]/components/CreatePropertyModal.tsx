"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  Typography,
  Upload,
  InputNumber,
} from "antd";
import { Upload as UploadIcon, X } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../../types";

interface CreatePropertyModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Property, "id" | "createdAt" | "updatedAt">) => void;
  clusterTypeId: number;
}

export default function CreatePropertyModal({
  open,
  onCancel,
  onSubmit,
  clusterTypeId,
}: CreatePropertyModalProps) {
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      clusterTypeId,
      property_photo_urls: values.images || [],
    });
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
          Buat Data Properti
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
          label="Nama Properti"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan nama properti!" }]}
        >
          <Input placeholder="Masukkan nama properti" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea placeholder="Masukkan deskripsi" rows={3} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Harga"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan harga!" }]}
        >
          <InputNumber
            placeholder="Masukkan harga"
            className="!w-full"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Harga Jual"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan harga jual!" }]}
        >
          <InputNumber
            placeholder="Masukkan harga jual"
            className="!w-full"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Lokasi"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan lokasi!" }]}
        >
          <Input placeholder="Masukkan lokasi" />
        </Form.Item>

        <Form.Item
          name="collateralAddress"
          label="Alamat Agunan"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan alamat agunan!" }]}
        >
          <Input placeholder="Masukkan alamat agunan" />
        </Form.Item>

        <Form.Item
          name="landArea"
          label="Luas Tanah (m²)"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan luas tanah!" }]}
        >
          <InputNumber placeholder="Masukkan luas tanah" className="!w-full" />
        </Form.Item>

        <Form.Item
          name="buildingArea"
          label="Luas Bangunan (m²)"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan luas bangunan!" }]}
        >
          <InputNumber
            placeholder="Masukkan luas bangunan"
            className="!w-full"
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stok"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan stok!" }]}
        >
          <InputNumber
            placeholder="Masukkan stok"
            className="!w-full"
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="spesifications"
          label="Spesifikasi"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan spesifikasi!" }]}
        >
          <Input.TextArea placeholder="Masukkan spesifikasi" rows={3} />
        </Form.Item>

        <Form.Item
          name="facilities"
          label="Fasilitas"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan fasilitas!" }]}
        >
          <Input placeholder="Masukkan fasilitas (pisahkan dengan koma)" />
        </Form.Item>

        <Form.Item
          name="latitude"
          label="Latitude"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan latitude!" }]}
        >
          <Input placeholder="Masukkan latitude" />
        </Form.Item>

        <Form.Item
          name="longitude"
          label="Longitude"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan longitude!" }]}
        >
          <Input placeholder="Masukkan longitude" />
        </Form.Item>

        <Form.Item
          name="images"
          label="Gambar"
          className="!mb-2"
          rules={[
            { required: true, message: "Mohon upload minimal satu gambar!" },
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
              Upload Gambar
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
