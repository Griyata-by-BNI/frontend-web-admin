"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Typography,
  Upload,
} from "antd";
import { Upload as UploadIcon, X, MapPin } from "lucide-react";
import { useState } from "react";
import { FacitiliesData } from "../../_constants";
import dynamic from "next/dynamic";
import type { Cluster } from "@/types/cluster";
import { useNearbyPlaces } from "../_hooks/useNearbyPlaces";

const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

interface CreateClusterModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Cluster, "id" | "created_at" | "updated_at">) => void;
}

const categories = [
  { key: "hospitals", label: "Rumah Sakit" },
  { key: "schools", label: "Sekolah" },
  { key: "colleges", label: "Perguruan Tinggi" },
  { key: "supermarkets", label: "Supermarket" },
  { key: "publicPlaces", label: "Tempat Umum" },
  { key: "trainStations", label: "Stasiun Kereta" },
  { key: "busStops", label: "Halte Bus" },
];

export default function CreateClusterModal({
  open,
  onCancel,
  onSubmit,
}: CreateClusterModalProps) {
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{
    lat?: number;
    lng?: number;
  }>({});

  const {
    nearbyPlaces,
    loading: loadingPlaces,
    fetchNearbyPlaces,
    resetPlaces,
  } = useNearbyPlaces();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
    setPreviewImages([]);
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImages([]);
    setCoordinates({});
    resetPlaces();
    onCancel();
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    form.setFieldsValue({ latitude: lat, longitude: lng });
    fetchNearbyPlaces(lat, lng);
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Buat Data Cluster
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
          <Input placeholder="Masukkan nama cluster" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Nomor Telepon"
          className="!mb-3"
          rules={[
            { required: true, message: "Mohon masukkan nomor telepon!" },
            { min: 10, message: "Nomor telepon minimal 10 digit!" },
          ]}
        >
          <Input placeholder="081234567890" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Alamat"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan alamat!" }]}
        >
          <Input.TextArea placeholder="Masukkan alamat lengkap" rows={2} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="latitude"
            label="Latitude"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan latitude!" }]}
          >
            <Input placeholder="Masukkan latitude" type="number" step="any" />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan longitude!" }]}
          >
            <Input placeholder="Masukkan longitude" type="number" step="any" />
          </Form.Item>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Pilih Lokasi di Peta
          </label>
          <MapSelector
            latitude={coordinates.lat}
            longitude={coordinates.lng}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        <Spin
          spinning={loadingPlaces}
          tip="Memuat data tempat terdekat..."
          wrapperClassName="min-h-[50px]"
        >
          {categories.some(
            ({ key }) =>
              (nearbyPlaces[key as keyof typeof nearbyPlaces] || []).length > 0
          ) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Tempat Terdekat</span>
              </div>

              {categories.map(({ key, label }) => {
                const places =
                  nearbyPlaces[key as keyof typeof nearbyPlaces] || [];
                if (places.length === 0) return null;

                return (
                  <div key={key} className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      {label}:
                    </p>
                    {places.map((place, idx) => (
                      <p key={idx} className="text-xs text-gray-600">
                        • {place.name} ({place.distance}m)
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </Spin>

        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea placeholder="Masukkan deskripsi" rows={3} />
        </Form.Item>

        <Form.Item
          name="facilities"
          label="Fasilitas"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon pilih fasilitas!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Pilih fasilitas"
            options={FacitiliesData.map((facility) => ({
              label: facility,
              value: facility,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="images"
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
