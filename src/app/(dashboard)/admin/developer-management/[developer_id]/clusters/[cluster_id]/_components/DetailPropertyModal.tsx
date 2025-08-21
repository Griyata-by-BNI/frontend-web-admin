"use client";

import {
  App,
  Button,
  Modal,
  Typography,
  Descriptions,
  Tag,
  Divider,
  Skeleton,
  Tooltip,
  Space,
} from "antd";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFetchPropertyById } from "@/services/propertyServices";
import { bniRegions } from "../../../constants";
import type { PropertyDetail } from "@/types/property";
import ImageGallery from "./ImageGallery";

interface DetailPropertyModalProps {
  propertyId: number;
}

export default function DetailPropertyModal({
  propertyId,
}: DetailPropertyModalProps) {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDetail = useFetchPropertyById();

  useEffect(() => {
    if (!modalOpen || !propertyId) return;
    fetchDetail.mutate(propertyId, {
      onError: () => {
        message.error("Gagal memuat data properti");
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, propertyId]);

  const propertyData: PropertyDetail | null = fetchDetail.data?.data ?? null;

  const specsArray: string[] = useMemo(() => {
    const raw =
      propertyData?.spesifications ?? propertyData?.spesifications ?? "";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [propertyData?.spesifications, propertyData?.spesifications]);

  const regionName = useMemo(() => {
    const rid = Number(propertyData?.regionId ?? 0);
    return bniRegions.find((r) => Number(r.value) === rid)?.label ?? "-";
  }, [propertyData?.regionId]);

  const priceText = useMemo(() => {
    const num = Number(propertyData?.price ?? 0);
    return num ? new Intl.NumberFormat("id-ID").format(num) : "-";
  }, [propertyData?.price]);

  const landArea = propertyData?.landArea ?? propertyData?.landArea ?? null;
  const buildingArea =
    propertyData?.buildingArea ?? propertyData?.buildingArea ?? null;

  const images: string[] = Array.isArray(propertyData?.property_photo_urls)
    ? (propertyData?.property_photo_urls as string[])
    : [];

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Detail Properti">
        <Button
          size="small"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        />
      </Tooltip>

      <Modal
        centered
        destroyOnHidden
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Detail Properti
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        onCancel={handleCancel}
        okButtonProps={{ className: "!hidden" }}
        cancelText="Tutup"
        classNames={{
          body: "!pt-2 max-h-[75vh] overflow-y-auto !px-6",
          content: "!p-0",
          header: "!pt-5 !px-6",
          footer: "!pb-5 !px-6",
        }}
        confirmLoading={fetchDetail.isPending}
      >
        {fetchDetail.isPending ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <>
            {/* Nama & Deskripsi */}
            <div className="mb-2">
              <Typography.Title level={4} className="!mb-0">
                {propertyData?.name ?? "-"}
              </Typography.Title>
            </div>

            {images.length > 0 ? (
              <ImageGallery
                images={images}
                name={propertyData?.name ?? "gambar properti"}
              />
            ) : (
              <div className="mt-2">
                <Tag>Belum ada gambar</Tag>
              </div>
            )}

            <Divider className="!my-3" />
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ width: 180 }}
              className="!mb-2"
              bordered
            >
              <Descriptions.Item label="Deskripsi">
                {propertyData?.description ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Harga">{priceText}</Descriptions.Item>

              <Descriptions.Item label="Lokasi">
                {propertyData?.location ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Alamat Agunan">
                {propertyData?.collateralAddress ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Wilayah BNI">
                {regionName}
              </Descriptions.Item>

              <Descriptions.Item label="Luas Tanah (m²)">
                {landArea ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Luas Bangunan (m²)">
                {buildingArea ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Jumlah Lantai">
                {propertyData?.jumlahLantai ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Kamar Tidur">
                {propertyData?.jumlahKamarTidur ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Kamar Mandi">
                {propertyData?.jumlahKamarMandi ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Stok">
                {propertyData?.stock ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Fasilitas Lainnya">
                <Space size={6} wrap>
                  {specsArray.length > 0 ? (
                    <Space size={[6, 6]} wrap>
                      {specsArray.map((s, i) => (
                        <Tag key={`${s}-${i}`}>{s}</Tag>
                      ))}
                    </Space>
                  ) : (
                    <Tag>Spesifikasi belum diisi</Tag>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
}
