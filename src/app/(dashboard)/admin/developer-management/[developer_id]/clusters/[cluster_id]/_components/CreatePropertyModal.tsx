"use client";

import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
  Upload,
} from "antd";
import { Plus, Upload as UploadIcon, X } from "lucide-react";
import { useState } from "react";
import { useCreateProperty } from "@/services/propertyServices";
import type { CreatePropertyPayload } from "@/types/property";
import { bniRegions, initialSpecOptions } from "../../../constants";
import { useImageStore } from "@/stores";
import { createBeforeUploadImage } from "@/utils/uploadValidators";

interface CreatePropertyModalProps {
  clusterTypeId: number;
}

export default function CreatePropertyModal({
  clusterTypeId,
}: CreatePropertyModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [specOptions, setSpecOptions] = useState(initialSpecOptions);

  const {
    fileList,
    setFileList,
    ensurePreviews,
    removeByUid,
    reset: resetImages,
  } = useImageStore();

  const createMutation = useCreateProperty();

  const resetAll = () => {
    form.resetFields();
    resetImages();
  };

  const handleCancel = () => {
    setModalOpen(false);
    resetAll();
  };

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Mohon upload minimal satu gambar!");
      return;
    }

    const specsString = (values.specifications || [])
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(", ");

    const newFiles: File[] = fileList
      .map((f) => f.originFileObj)
      .filter(Boolean) as File[];

    const payload: CreatePropertyPayload = {
      clusterTypeId,
      name: values.name,
      description: values.description,
      price: String(values.price),
      location: values.location ?? "",
      isDeleted: false,
      spesification: specsString,
      collateralAddress: values.collateralAddress ?? "",
      regionId: Number(values.regionId),
      stock: Number(values.stock ?? 0),
      luasTanah: values.landArea ? Number(values.landArea) : null,
      luasBangunan: values.buildingArea ? Number(values.buildingArea) : null,
      jumlahLantai:
        values.jumlahLantai != null ? Number(values.jumlahLantai) : null,
      jumlahKamarTidur:
        values.jumlahKamarTidur != null
          ? Number(values.jumlahKamarTidur)
          : null,
      jumlahKamarMandi:
        values.jumlahKamarMandi != null
          ? Number(values.jumlahKamarMandi)
          : null,
      garasi: Boolean(values.garasi ?? false),
      kolamRenang: Boolean(values.kolamRenang ?? false),
      photos: newFiles,
    };

    try {
      await createMutation.mutateAsync(payload);
      message.success("Properti berhasil dibuat");
      setModalOpen(false);
      resetAll();
    } catch {
      message.error("Gagal membuat properti");
    }
  };

  const beforeUpload = createBeforeUploadImage({
    maxMB: 10,
    onInvalid: (m) => message.error(m),
  });

  return (
    <>
      <Button
        size="small"
        icon={<Plus className="w-3 h-3" />}
        onClick={() => setModalOpen(true)}
      >
        Tambah Properti
      </Button>

      <Modal
        centered
        destroyOnHidden
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Buat Data Properti
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={createMutation.isPending ? "Menyimpan..." : "Buat"}
        okButtonProps={{ loading: createMutation.isPending }}
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
            rules={[
              { required: true, message: "Mohon masukkan nama properti!" },
            ]}
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
              formatter={(v) =>
                `${v ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(v) => (v ? v.replace(/[.\s]/g, "") : "")}
            />
          </Form.Item>

          <Form.Item
            name="landArea"
            label="Luas Tanah (m²)"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan luas tanah!" }]}
          >
            <InputNumber
              min={10}
              placeholder="Masukkan luas tanah"
              className="!w-full"
            />
          </Form.Item>

          <Form.Item
            name="buildingArea"
            label="Luas Bangunan (m²)"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan luas bangunan!" },
            ]}
          >
            <InputNumber
              min={10}
              placeholder="Masukkan luas bangunan"
              className="!w-full"
            />
          </Form.Item>

          <Form.Item
            name="jumlahLantai"
            label="Jumlah Lantai"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan jumlah lantai!" },
            ]}
          >
            <InputNumber min={1} className="!w-full" placeholder="Contoh: 2" />
          </Form.Item>

          <Form.Item
            name="jumlahKamarTidur"
            label="Jumlah Kamar Tidur"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan jumlah kamar tidur!" },
            ]}
          >
            <InputNumber min={1} className="!w-full" placeholder="Contoh: 4" />
          </Form.Item>

          <Form.Item
            name="jumlahKamarMandi"
            label="Jumlah Kamar Mandi"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan jumlah kamar mandi!" },
            ]}
          >
            <InputNumber min={0} className="!w-full" placeholder="Contoh: 2" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stok"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan stok rumah!" }]}
          >
            <InputNumber min={0} className="!w-full" placeholder="Contoh: 4" />
          </Form.Item>

          {/* Spesifikasi */}
          <Form.Item
            name="specifications"
            label="Spesifikasi"
            className="!mb-3"
            rules={[
              {
                required: true,
                message: "Mohon pilih/setidaknya satu spesifikasi!",
              },
            ]}
          >
            <Select
              mode="tags"
              allowClear
              placeholder="Pilih atau ketik spesifikasi (mis. Kolam Renang, Gym)"
              options={specOptions}
              onChange={(values: string[]) => {
                const current = new Set(specOptions.map((o) => o.value));
                const toAdd = values
                  .filter((v) => !current.has(v))
                  .map((v) => ({ label: v, value: v }));
                if (toAdd.length) setSpecOptions((prev) => [...prev, ...toAdd]);
              }}
            />
          </Form.Item>

          <Form.Item
            name="regionId"
            label="Wilayah BNI"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon pilih wilayah BNI!" }]}
          >
            <Select placeholder="Pilih wilayah BNI" options={bniRegions} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Kota / Provinsi"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon isi kota / provinsi!" }]}
          >
            <Input placeholder="Masukkan kota / provinsi" />
          </Form.Item>

          <Form.Item
            name="collateralAddress"
            label="Alamat Lengkap Rumah"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon isi alamat lengkap rumah!" },
            ]}
          >
            <Input.TextArea
              placeholder="Masukkan alamat lengkap rumah"
              rows={3}
            />
          </Form.Item>

          {/* 🔹 Upload dikontrol oleh store (bukan Form) */}
          <Form.Item label="Gambar" className="!mb-3">
            <Upload
              multiple
              showUploadList={false}
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={async ({ fileList: fl }) => {
                setFileList(fl);
                await ensurePreviews(); // isi thumbUrl untuk file baru
              }}
            >
              <Button icon={<UploadIcon className="w-4 h-4" />}>
                Upload Gambar
              </Button>
            </Upload>
          </Form.Item>

          {/* Preview gabungan (url lama — untuk create tidak ada — & thumbUrl baru) */}
          {fileList.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {fileList.map((file, index) => {
                const src = file.url ?? file.thumbUrl;
                if (!src) return null;
                return (
                  <div
                    key={file.uid}
                    className="relative border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={file.name || `Preview ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                    <Button
                      shape="circle"
                      size="small"
                      className="!absolute top-1 right-1 !z-[9999999] flex items-center justify-center"
                      onClick={() => removeByUid(file.uid)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}
