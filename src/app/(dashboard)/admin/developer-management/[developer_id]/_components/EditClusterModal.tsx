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
  type UploadFile,
} from "antd";
import { useClusterById, useUpdateCluster } from "@/services/clusterServices";
import { Edit, MapPin, Upload as UploadIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FacitiliesData } from "../../_constants";
import { useNearbyPlaces } from "../_hooks/useNearbyPlaces";
import { NearbyPlaceTypeLabel } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { useImageStore } from "@/stores"; // ⬅️ gunakan store gambar (Zustand)
import { createBeforeUploadImage } from "@/utils/uploadValidators";

const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

export default function EditClusterModal({ clusterId }: { clusterId: string }) {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat?: number;
    lng?: number;
  }>({});

  const { message } = App.useApp();
  const pathname = usePathname();
  const isDetailPage = pathname.includes("/clusters");
  const queryClient = useQueryClient();
  const { mutate, status } = useUpdateCluster();
  const initialPhotoUrlsRef = useRef<string[]>([]);

  const {
    fileList,
    setFileList,
    setFromUrls,
    ensurePreviews,
    removeByUid,
    reset: resetImages,
  } = useImageStore();

  const { data: clusterData, isLoading } = useClusterById(clusterId, modalOpen);

  const {
    nearbyPlaces,
    loading: loadingPlaces,
    fetchNearbyPlaces,
    resetPlaces,
  } = useNearbyPlaces();

  useEffect(() => {
    if (!modalOpen || !clusterData?.data?.clusters?.[0]) return;

    const cluster = clusterData.data.clusters[0];

    form.setFieldsValue({
      ...cluster,
      facilities: cluster.facilities ? cluster.facilities.split(",") : [],
    });

    initialPhotoUrlsRef.current = cluster.cluster_photo_urls || [];

    const urls: string[] = cluster.cluster_photo_urls || [];
    setFromUrls(urls);
    const lat = cluster.latitude ? Number(cluster.latitude) : undefined;
    const lng = cluster.longitude ? Number(cluster.longitude) : undefined;
    setCoordinates({ lat, lng });
    if (lat != null && lng != null) {
      handleLocationSelect(lat, lng);
    }
  }, [modalOpen, clusterData]);

  const handleCancel = () => {
    form.resetFields();
    setCoordinates({});
    resetPlaces();
    resetImages(); // ⬅️ bersihkan fileList store
    setModalOpen(false);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    form.setFieldsValue({ latitude: lat, longitude: lng });
    fetchNearbyPlaces(lat, lng);
  };

  const handleSubmit = (values: any) => {
    try {
      const images: File[] = fileList
        .map((f) => f.originFileObj)
        .filter(Boolean) as File[];

      const keepPhotoUrls: string[] = fileList
        .filter((f) => !f.originFileObj && !!f.url)
        .map((f) => f.url!) as string[];

      const deletePhotoUrls: string[] = initialPhotoUrlsRef.current.filter(
        (url) => !keepPhotoUrls.includes(url)
      );

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
            photos: images, // kirim hanya file baru
            facilities: (values.facilities || []).join(", "),
            nearbyPlaces,
          },
          deletePhotoUrls,
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

  const beforeUpload = createBeforeUploadImage({
    maxMB: 10,
    onInvalid: (m) => message.error(m),
  });

  return (
    <>
      <Modal
        destroyOnHidden
        centered
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Edit Data Cluster
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        okButtonProps={{
          loading: status === "pending",
          disabled: loadingPlaces,
        }}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={status === "pending" ? "Menyimpan" : "Simpan Perubahan"}
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
            <Input
              placeholder="Masukkan nama cluster"
              maxLength={100}
              showCount
            />
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
            <Input placeholder="081234567890" maxLength={15} showCount />
          </Form.Item>

          <Form.Item
            name="address"
            label="Alamat"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan alamat!" }]}
          >
            <Input.TextArea
              placeholder="Masukkan alamat lengkap"
              rows={2}
              maxLength={1000}
              showCount
            />
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
            <Input.TextArea
              placeholder="Masukkan deskripsi"
              rows={3}
              maxLength={1000}
              showCount
            />
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
              maxCount={15}
            >
              <Button icon={<UploadIcon className="w-4 h-4" />}>
                Upload Gambar
              </Button>
            </Upload>
          </Form.Item>

          {/* PREVIEW gabungan (lama dari url + baru dari thumbUrl) */}
          {fileList.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {fileList.map((file, index) => {
                const src = file.url ?? file.thumbUrl;
                if (!src) return null;
                return (
                  <div
                    key={file.uid}
                    className="relative border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={file.name || `Preview ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                    <Button
                      shape="circle"
                      size="small"
                      className="!absolute top-1 right-1 !z-[9999999]"
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
