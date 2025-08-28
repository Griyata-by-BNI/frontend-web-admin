"use client";

import { usePropertyById } from "@/services/propertyServices";
import { DownOutlined } from "@ant-design/icons";
import { Col, Collapse, Row, Skeleton, Empty, Carousel } from "antd";
import Image from "next/image";
import { useEffect, useMemo } from "react";

type PropertyInformationProps = {
  propertyId?: number;
  title?: string;
};

export default function PropertyInformation({
  propertyId,
  title = "Informasi Properti",
}: PropertyInformationProps) {
  const { data, isLoading, isFetching } = usePropertyById(propertyId);
  const loading = !!propertyId && (isLoading || isFetching);
  const property = useMemo(() => data?.data ?? null, [data]);

  const ContentSkeleton = () => (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={8} md={6}>
        <div className="w-[200px] h-[120px] rounded-md overflow-hidden">
          <Skeleton.Image active className="!w-[200px] !h-[120px]" />
        </div>
      </Col>
      <Col xs={24} sm={16} md={18}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton.Input
                active
                size="small"
                style={{ width: 120, height: 14 }}
              />
              <Skeleton
                active
                title={false}
                paragraph={{ rows: 1, width: ["80%"] }}
                className="!m-0"
              />
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );

  const ContentLoaded = () =>
    property ? (
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8} md={6}>
          {property?.property_photo_urls?.length ? (
            <Carousel
              autoplay
              dots
              arrows
              className="rounded-md overflow-hidden"
            >
              {property.property_photo_urls.map((src: string, idx: number) => (
                <div key={idx} className="w-full h-[150px]">
                  <Image
                    src={src}
                    alt={`property-photo-${idx + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-[150px] object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="w-full h-[150px] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Tidak ada foto"
              />
            </div>
          )}
        </Col>

        <Col xs={24} sm={16} md={18}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nama Cluster</p>
              <p className="font-semibold text-gray-800">
                {property?.clusterName ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Nama Properti</p>
              <p className="font-semibold text-gray-800">
                {property?.name ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Alamat</p>
              <p className="font-semibold text-gray-800">
                {property?.collateralAddress ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Harga</p>
              <p className="font-bold text-primary-tosca text-lg">
                {typeof property?.price === "number" ||
                typeof property?.price === "string"
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(Number(property.price))
                  : "-"}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    ) : (
      <div className="py-6">
        <Empty description="Tidak ada properti dipilih" />
      </div>
    );

  return (
    <Row className="mt-4 md:mt-8">
      <Col span={24}>
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          className="bg-white"
          items={[
            {
              key: "1",
              label: (
                <span className="font-semibold text-gray-700">{title}</span>
              ),
              children: loading ? <ContentSkeleton /> : <ContentLoaded />,
            },
          ]}
        />
      </Col>
    </Row>
  );
}
