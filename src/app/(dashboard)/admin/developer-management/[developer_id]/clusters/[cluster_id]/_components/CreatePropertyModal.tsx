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
  type UploadFile,
} from "antd";
import { Minus, Plus, Upload as UploadIcon, X } from "lucide-react";
import { useState } from "react";
import { useCreateProperty } from "@/services/propertyServices";
import type { CreatePropertyPayload } from "@/types/property";

interface CreatePropertyModalProps {
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

const initialSpecOptions = [
  { label: "Kolam Renang", value: "Kolam Renang" },
  { label: "Gym", value: "Gym" },
  { label: "Garasi", value: "Garasi" },
  { label: "Taman", value: "Taman" },
];

// helper konversi UploadFile[] -> File[]
const toFiles = (fileList: UploadFile[]): File[] =>
  fileList.map((f) => f.originFileObj).filter(Boolean) as File[];

export default function CreatePropertyModal({
  clusterTypeId,
}: CreatePropertyModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [specOptions, setSpecOptions] = useState(initialSpecOptions);

  const createMutation = useCreateProperty();

  const resetAll = () => {
    form.resetFields();
    setPreviewImages([]);
  };

  const handleSubmit = async (values: any) => {
    const specsString = (values.specifications || [])
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(", ");

    const files = toFiles(values.photos || []);

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

      // ⬇️ tambahkan ini (pakai key backend persis):
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
      photos: files,
    };

    try {
      await createMutation.mutateAsync(payload);
      message.success("Properti berhasil dibuat");
      setModalOpen(false);
      resetAll();
    } catch (e) {
      message.error("Gagal membuat properti");
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    resetAll();
  };

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
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v!.replace(/(,|\s)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="landArea"
            label="Luas Tanah (m²)"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan luas tanah!" }]}
          >
            <InputNumber
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
            <InputNumber min={0} className="!w-full" placeholder="Contoh: 2" />
          </Form.Item>

          <Form.Item
            name="jumlahKamarTidur"
            label="Jumlah Kamar Tidur"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan jumlah kamar tidur!" },
            ]}
          >
            <InputNumber min={0} className="!w-full" placeholder="Contoh: 4" />
          </Form.Item>

          <Form.Item
            name="jumlahKamarMandi"
            label="Jumlah Kamar Mandi"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan jumlah kamar mandi!" },
            ]}
          >
            <InputNumber min={0} className="!w-full" placeholder="Contoh: 4" />
          </Form.Item>

          {/* Spesifikasi */}
          <div className="!mb-3">
            <label className="block text-sm font-medium mb-2">
              Spesifikasi
            </label>

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
                mode="tags" // bisa pilih multiple & tambah item baru
                allowClear
                placeholder="Pilih atau ketik spesifikasi (mis. Kolam Renang, Gym)"
                options={specOptions}
                onChange={(values: string[]) => {
                  // tambahkan item baru ke dropdown options agar muncul di daftar
                  const current = new Set(specOptions.map((o) => o.value));
                  const toAdd = values
                    .filter((v) => !current.has(v))
                    .map((v) => ({ label: v, value: v }));
                  if (toAdd.length)
                    setSpecOptions((prev) => [...prev, ...toAdd]);
                }}
              />
            </Form.Item>
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
            valuePropName="fileList"
            rules={[
              {
                validator: async (_, value: UploadFile[]) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      new Error("Mohon upload minimal satu gambar!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              multiple
              listType="picture"
              beforeUpload={() => false} // manual upload
              showUploadList={false} // kita handle preview sendiri
              onChange={async (info) => {
                const list = info.fileList;
                form.setFieldValue("photos", list);
                // buat preview
                if (list.length > 0) {
                  const previews = await Promise.all(
                    list.map(
                      (f) =>
                        new Promise<string>((res) => {
                          if (!f.originFileObj) return res("");
                          const reader = new FileReader();
                          reader.onload = () => res(reader.result as string);
                          reader.readAsDataURL(f.originFileObj);
                        })
                    )
                  );
                  setPreviewImages(previews.filter(Boolean));
                } else {
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
                        const list: UploadFile[] = (
                          form.getFieldValue("photos") || []
                        ).filter((_: UploadFile, i: number) => i !== index);
                        form.setFieldValue("photos", list);
                        setPreviewImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
