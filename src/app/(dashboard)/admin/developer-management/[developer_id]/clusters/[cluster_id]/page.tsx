"use client";

import { useClusterById } from "@/services";
import "@ant-design/v5-patch-for-react-19";
import { Breadcrumb, Col, Collapse, Row, Tag } from "antd";
import { useParams, useRouter } from "next/navigation";
import DeleteClusterModal from "../../_components/DeleteClusterModal";
import EditClusterModal from "../../_components/EditClusterModal";
import SkeletonDetailDeveloper from "../../_components/SkeletonDetailDeveloper";
import { NearbyPlaceTypeLabel } from "../../constants";
import ClusterMap from "./_components/ClusterMap";
import ImageGallery from "./_components/ImageGallery";
import TableClusterType from "./_components/TableClusterType";
import CreateClusterTypeModal from "./_components/CreateClusterTypeModal";
import { NearbyPlacesCollapse } from "./_components/NearbyPlacesCollapse";

const formatIDR = (n?: string | number) => {
  const num =
    typeof n === "string" ? Number(n.replace(/[^\d.-]/g, "")) : Number(n ?? 0);
  if (Number.isNaN(num) || num === 0) return "-";
  return new Intl.NumberFormat("id-ID").format(num);
};

export default function ClusterDetailPage() {
  const params = useParams();
  const developerId = params.developer_id as string;
  const clusterId = params.cluster_id as string;

  const router = useRouter();
  const { data, status } = useClusterById(clusterId as string);
  const cluster = data?.data?.clusters?.[0];

  if (status === "pending") {
    return <SkeletonDetailDeveloper />;
  }

  if (!cluster) {
    return <div className="p-4">Cluster tidak ditemukan</div>;
  }

  // Normalisasi fasilitas agar aman saat null/empty
  const facilities = String(cluster.facilities || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="mb-4 flex flex-col gap-3 px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl text-primary-black font-bold truncate">
            {cluster.name}
          </p>

          {/* Breadcrumb bisa geser di layar sempit */}
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Breadcrumb
              items={[
                { title: "Dashboard" },
                {
                  title: "Developer Management",
                  onClick: () => router.push("/admin/developer-management"),
                },
                {
                  title: cluster.developerName,
                  onClick: () =>
                    router.push(`/admin/developer-management/${developerId}`),
                },
                {
                  title: (
                    <span className="text-dark-tosca font-semibold">
                      {cluster.name}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Actions: wrap di mobile */}
        <div className="flex flex-wrap gap-2 justify-start md:justify-end pb-0 md:pb-2">
          <EditClusterModal clusterId={String(cluster.id)} />
          <DeleteClusterModal dataCluster={cluster} />
        </div>
      </div>

      {/* Konten */}
      <div className="mt-2 overflow-hidden">
        <Row
          gutter={[
            { xs: 12, sm: 16, md: 24 },
            { xs: 12, sm: 16, md: 24 },
          ]}
        >
          {/* Galeri gambar */}
          <Col xs={24} md={8}>
            <ImageGallery
              images={cluster.cluster_photo_urls}
              name={cluster.name}
            />
          </Col>

          {/* Deskripsi + info ringkas */}
          <Col xs={24} md={16}>
            <div className="flex items-center justify-between">
              <p className="text-base sm:text-lg font-bold text-primary-black">
                Deskripsi
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-primary-black text-justify text-sm sm:text-base leading-relaxed break-words">
                {cluster.description || "-"}
              </p>

              <Row gutter={[12, 12]}>
                {(cluster.minPrice || cluster.maxPrice) && (
                  <Col xs={24} sm={12}>
                    <div>
                      <p className="text-base font-bold text-primary-black">
                        Range Harga
                      </p>
                      <p className="text-primary-black text-sm sm:text-base">
                        {formatIDR(cluster.minPrice) !== "-" &&
                        formatIDR(cluster.maxPrice) !== "-"
                          ? `Rp ${formatIDR(cluster.minPrice)} - Rp ${formatIDR(
                              cluster.maxPrice
                            )}`
                          : "-"}
                      </p>
                    </div>
                  </Col>
                )}

                <Col xs={24} sm={12}>
                  <div>
                    <p className="text-base font-bold text-primary-black">
                      Informasi Kontak
                    </p>
                    <p className="text-primary-black text-sm sm:text-base break-words">
                      {cluster.phoneNumber || "-"}
                    </p>
                  </div>
                </Col>
              </Row>

              <div>
                <p className="text-base font-bold text-primary-black mb-2">
                  Fasilitas
                </p>

                {facilities.length > 0 ? (
                  <Row gutter={[8, 8]}>
                    {facilities.map((facility, i) => (
                      <Col key={`${facility}-${i}`}>
                        <Tag>{facility}</Tag>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <span className="text-sm text-gray-600">-</span>
                )}
              </div>
            </div>
          </Col>

          {/* Lokasi + peta */}
          <Col span={24}>
            <div className="mb-4">
              <p className="text-base sm:text-lg font-bold text-primary-black mb-2">
                Lokasi
              </p>

              <ClusterMap
                latitude={parseFloat(cluster.latitude)}
                longitude={parseFloat(cluster.longitude)}
                name={cluster.name}
              />

              <div className="mt-2 text-xs sm:text-sm text-gray-600 break-words">
                <p>Alamat: {cluster.address || "-"}</p>
              </div>
            </div>

            <NearbyPlacesCollapse cluster={cluster} />
          </Col>

          {/* Cluster Type + Tombol Create */}
          <Col span={24}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <p className="text-base sm:text-lg font-bold text-primary-black">
                Cluster Type
              </p>
              <div className="flex justify-start sm:justify-end">
                <CreateClusterTypeModal />
              </div>
            </div>

            {/* Tabel bisa di-scroll di mobile */}
            <div className="w-full overflow-x-auto">
              <TableClusterType clusterId={cluster.id} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
