"use client";

import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { useClusterById, useUpdateCluster } from "@/services/clusterServices";
import { Edit, MapPin, Upload as UploadIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FacitiliesData } from "../../_constants";
import { useNearbyPlaces } from "../_hooks/useNearbyPlaces";
import { NearbyPlaceTypeLabel } from "../constants";
import { useQueryClient } from "@tanstack/react-query";

const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

export default function EditClusterModal({ clusterId }: { clusterId: string }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{
    lat?: number;
    lng?: number;
  }>({});

  const { data: clusterData, isLoading } = useClusterById(clusterId, modalOpen);

  const {
    nearbyPlaces,
    loading: loadingPlaces,
    fetchNearbyPlaces,
    resetPlaces,
  } = useNearbyPlaces();

  useEffect(() => {
    if (clusterData?.data?.clusters?.[0] && modalOpen) {
      const cluster = clusterData.data.clusters[0];

      const initialFileList: UploadFile[] = (
        cluster.cluster_photo_urls || []
      ).map((url: string, i: number) => ({
        uid: `init-${i}`,
        name: `photo-${i + 1}`,
        status: "done",
        url, // penting: biar Upload kenal sebagai file yang sudah ada
      }));

      form.setFieldsValue({
        ...cluster,
        facilities: cluster.facilities ? cluster.facilities.split(",") : [],
        images: initialFileList, // <-- bukan array string
      });

      setPreviewImages([...(cluster.cluster_photo_urls || [])]);

      const lat = cluster.latitude ? Number(cluster.latitude) : undefined;
      const lng = cluster.longitude ? Number(cluster.longitude) : undefined;

      setCoordinates({ lat, lng });
      if (lat != null && lng != null) {
        handleLocationSelect(lat, lng);
      }
    }
  }, [clusterData, form, modalOpen]);

  const handleCancel = () => {
    form.resetFields();
    setPreviewImages([]);
    setCoordinates({});
    resetPlaces();
    setModalOpen(false);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    form.setFieldsValue({ latitude: lat, longitude: lng });
    fetchNearbyPlaces(lat, lng);
  };

  const { message } = App.useApp();
  const pathname = usePathname();
  const isDetailPage = pathname.includes("/clusters");

  const queryClient = useQueryClient();
  const { mutate, status } = useUpdateCluster();

  const handleSubmit = (values: any) => {
    try {
      const fileList: UploadFile[] = values.images || [];

      // Ambil hanya file baru (yang punya originFileObj)
      const images: File[] = fileList
        .map((f) => f.originFileObj)
        .filter(Boolean) as File[];

      mutate(
        {
          id: String(clusterData?.data.clusters?.[0].id),
          payload: {
            ...values,
            developerId: clusterData?.data.clusters?.[0].developerId,
            createdBy: 1,
            updatedBy: 1,
            longitude: Number(values.longitude),
            latitude: Number(values.latitude),
            photos: images, // kirim file baru; server sebaiknya meng-overwrite
            facilities: values.facilities.join(", "),
            nearbyPlaces,
          },
        },
        {
          onSuccess: () => {
            handleCancel();
            queryClient.invalidateQueries({
              queryKey: [isDetailPage ? "cluster-detail" : "clusters"],
            });
          },
          onError: () => {
            message.error("Gagal memperbarui cluster, silakan coba lagi.");
          },
        }
      );
    } catch (err) {
      console.log(err);
      message.error("Gagal memperbarui cluster, silakan coba lagi.");
    }
  };

  return (
    <>
      <Modal
        zIndex={9999999}
        destroyOnHidden
        centered
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Edit Data Cluster
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        okButtonProps={{ loading: status === "pending" || loadingPlaces }}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Simpan Perubahan"
        classNames={{
          body: "!pt-2 max-h-[75vh] overflow-y-auto !px-6",
          content: "!p-0",
          header: "!pt-5 !px-6",
          footer: "!pb-5 !px-6",
        }}
        getContainer={false}
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
            name="phoneNumber"
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
              <Input
                placeholder="Masukkan longitude"
                type="number"
                step="any"
              />
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
            {nearbyPlaces.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Tempat Terdekat</span>
                </div>

                {nearbyPlaces.map((category, idx) => {
                  if (category.places.length === 0) return null;

                  return (
                    <div key={idx} className="mb-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {NearbyPlaceTypeLabel[category.type] ?? category.type}:
                      </p>

                      {category.places.map((place, idx2) => (
                        <p key={idx2} className="text-xs text-gray-600">
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
              {
                validator: (_, value: UploadFile[]) => {
                  return value && value.length > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Mohon upload minimal satu gambar!")
                      );
                },
              },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={() => false} // jangan auto-upload
              onChange={async (info) => {
                const files = info.fileList as UploadFile[];

                const previews = await Promise.all(
                  files.map(
                    (file) =>
                      new Promise<string | null>((resolve) => {
                        // Jika file lama (sudah ada) pakai url
                        if (file.url) return resolve(file.url);

                        // Jika file baru (dari komputer) baca sebagai dataURL
                        const raw = file.originFileObj as File | undefined;
                        if (raw) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            resolve(reader.result as string);
                          reader.readAsDataURL(raw);
                        } else {
                          resolve(null); // JANGAN pernah return ""!
                        }
                      })
                  )
                );

                setPreviewImages(
                  previews.filter((x): x is string => Boolean(x))
                );
              }}
            >
              <Button icon={<UploadIcon className="w-4 h-4" />}>
                Upload Gambar
              </Button>
            </Upload>
          </Form.Item>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative border border-gray-100 rounded-lg overflow-hidden"
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
                      // hapus preview index ke-`index`
                      const newPreviews = previewImages.filter(
                        (_, i) => i !== index
                      );
                      setPreviewImages(newPreviews);

                      // sinkronkan fileList (images) di form
                      const curr: UploadFile[] =
                        form.getFieldValue("images") || [];
                      const newFileList = curr.filter((_, i) => i !== index);
                      form.setFieldValue("images", newFileList);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Form>
      </Modal>

      {isDetailPage ? (
        <Button
          icon={<Edit className="w-4 h-4" />}
          className="w-max"
          onClick={() => setModalOpen(true)}
        >
          Edit
        </Button>
      ) : (
        <Button
          icon={<Edit className="w-4 h-4" />}
          onClick={() => {
            setModalOpen(true);
          }}
        />
      )}
    </>
  );
}
