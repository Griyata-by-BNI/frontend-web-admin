"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  Typography,
  Upload,
  InputNumber,
  Select,
  Space,
} from "antd";
import { Upload as UploadIcon, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import type { PayloadProperty } from "../../../../_types";

interface CreatePropertyModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: PayloadProperty) => void;
  clusterTypeId: number;
}

const bniRegions = [
  { value: 1, label: "Wilayah I - Sumatera" },
  { value: 2, label: "Wilayah II - Jakarta" },
  { value: 3, label: "Wilayah III - Jawa Barat" },
  { value: 4, label: "Wilayah IV - Jawa Tengah & DIY" },
  { value: 5, label: "Wilayah V - Jawa Timur" },
  { value: 6, label: "Wilayah VI - Kalimantan" },
  { value: 7, label: "Wilayah VII - Sulawesi" },
  { value: 8, label: "Wilayah VIII - Bali & Nusa Tenggara" },
  { value: 9, label: "Wilayah IX - Maluku & Papua" },
];

export default function CreatePropertyModal({
  open,
  onCancel,
  onSubmit,
  clusterTypeId,
}: CreatePropertyModalProps) {
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<
    { name: string; quantity: number }[]
  >([{ name: "", quantity: 1 }]);

  const handleSubmit = (values: any) => {
    const specsString = specifications
      .filter((spec) => spec.name.trim())
      .map((spec) => `${spec.quantity} ${spec.name}`)
      .join(", ");

    onSubmit({
      ...values,
      clusterTypeId,
      spesifications: specsString,
      photos: values.photos || [],
      createdBy: "admin",
      updatedBy: "admin",
    });
    form.resetFields();
    setPreviewImages([]);
    setSpecifications([{ name: "", quantity: 1 }]);
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImages([]);
    setSpecifications([{ name: "", quantity: 1 }]);
    onCancel();
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { name: "", quantity: 1 }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const updateSpecification = (
    index: number,
    field: "name" | "quantity",
    value: string | number
  ) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
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
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan nama properti!" }]}
        >
          <Input placeholder="Masukkan nama properti" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea placeholder="Masukkan deskripsi" rows={3} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Harga"
          className="!mb-3"
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
          name="landArea"
          label="Luas Tanah (m²)"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan luas tanah!" }]}
        >
          <InputNumber placeholder="Masukkan luas tanah" className="!w-full" />
        </Form.Item>

        <Form.Item
          name="buildingArea"
          label="Luas Bangunan (m²)"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan luas bangunan!" }]}
        >
          <InputNumber
            placeholder="Masukkan luas bangunan"
            className="!w-full"
          />
        </Form.Item>

        <div className="!mb-3">
          <label className="block text-sm font-medium mb-2">Spesifikasi</label>

          {specifications.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <InputNumber
                min={1}
                value={spec.quantity}
                onChange={(value) =>
                  updateSpecification(index, "quantity", value || 1)
                }
                controls={false}
                className="!w-10"
              />

              <Input
                placeholder="Nama spesifikasi (contoh: lantai, kamar tidur)"
                value={spec.name}
                onChange={(e) =>
                  updateSpecification(index, "name", e.target.value)
                }
                className="!w-full"
              />

              <Button
                icon={<Minus className="w-4 h-4" />}
                onClick={() => removeSpecification(index)}
                disabled={specifications.length === 1}
              />
            </div>
          ))}

          <Button
            type="dashed"
            icon={<Plus className="w-4 h-4" />}
            onClick={addSpecification}
            className="w-full"
          >
            Tambah Spesifikasi
          </Button>
        </div>

        <Form.Item
          name="regionId"
          label="Wilayah BNI"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon pilih wilayah BNI!" }]}
        >
          <Select placeholder="Pilih wilayah BNI" options={bniRegions} />
        </Form.Item>

        <Form.Item
          name="photos"
          label="Gambar"
          className="!mb-3"
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
                        form.setFieldValue("photos", images);
                        setPreviewImages(images);
                      }
                    };
                    reader.readAsDataURL(file.originFileObj);
                  }
                });
              } else {
                form.setFieldValue("photos", []);
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
                      form.setFieldValue("photos", newImages);
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
