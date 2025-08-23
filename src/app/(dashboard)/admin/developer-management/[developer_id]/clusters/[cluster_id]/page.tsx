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
    return <div>Cluster tidak ditemukan</div>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <div className="flex w-full justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-2xl text-primary-black font-bold">
              {cluster.name}
            </p>

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
                    <p className="text-dark-tosca font-semibold">
                      {cluster.name}
                    </p>
                  ),
                },
              ]}
            />
          </div>

          <div className="flex gap-2 pb-2">
            <EditClusterModal clusterId={String(cluster.id)} />

            <DeleteClusterModal dataCluster={cluster} />
          </div>
        </div>

        <div className="mt-4 overflow-hidden">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <ImageGallery
                images={cluster.cluster_photo_urls}
                name={cluster.name}
              />
            </Col>

            <Col xs={24} md={16}>
              <div className="flex justify-between items-end">
                <p className="text-lg font-bold text-primary-black">
                  Deskripsi
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-primary-black">{cluster.description}</p>
                </div>

                <Row gutter={16}>
                  {cluster.minPrice && cluster.maxPrice && (
                    <Col span={12}>
                      <div>
                        <p className="text-lg font-bold text-primary-black">
                          Range Harga
                        </p>

                        <p className="text-primary-black">
                          Rp{" "}
                          {parseInt(cluster.minPrice).toLocaleString("id-ID")} -
                          Rp{" "}
                          {parseInt(cluster.maxPrice).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </Col>
                  )}

                  <Col span={12}>
                    <div>
                      <p className="text-lg font-bold text-primary-black">
                        Informasi Kontak
                      </p>

                      <p className="text-primary-black">
                        {cluster.phoneNumber || "-"}
                      </p>
                    </div>
                  </Col>
                </Row>

                <div>
                  <p className="text-lg font-bold text-primary-black mb-2">
                    Fasilitas
                  </p>

                  {cluster.facilities.split(", ") ? (
                    <Row>
                      {cluster.facilities.split(", ").map((facility, index) => (
                        <Col key={index}>
                          <Tag>{facility}</Tag>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </Col>

            <Col span={24}>
              <div className="mb-4">
                <p className="text-lg font-bold text-primary-black mb-2">
                  Lokasi
                </p>

                <ClusterMap
                  latitude={parseFloat(cluster.latitude)}
                  longitude={parseFloat(cluster.longitude)}
                  name={cluster.name}
                />

                <div className="mt-2 text-sm text-gray-600">
                  <p>Alamat: {cluster.address}</p>
                </div>
              </div>

              <Collapse
                expandIconPosition="end"
                items={[
                  {
                    key: "1",
                    label: "Tempat Terdekat",
                    children: (
                      <Row gutter={[12, 12]}>
                        {Array.isArray(cluster.nearbyPlaces) &&
                          cluster.nearbyPlaces.map((category, idx) => {
                            if (category.places.length === 0) return null;

                            return (
                              <Col sm={24} md={12} lg={8} key={idx}>
                                <p className="text-xs font-medium text-gray-700 mb-1">
                                  {NearbyPlaceTypeLabel[category.type] ??
                                    category.type}
                                  :
                                </p>

                                {category.places.map((place, idx2) => (
                                  <p
                                    key={idx2}
                                    className="text-xs text-gray-600"
                                  >
                                    • {place.name} ({place.distance}m)
                                  </p>
                                ))}
                              </Col>
                            );
                          })}
                      </Row>
                    ),
                  },
                ]}
              />
            </Col>

            <Col span={24}>
              <div className="flex flex-col gap-2">
                <Row>
                  <Col>
                    <p className="text-lg font-bold text-primary-black mb-2">
                      Cluster Type
                    </p>
                  </Col>

                  <Col flex="auto">
                    <div className="flex justify-end">
                      <CreateClusterTypeModal />
                    </div>
                  </Col>
                </Row>

                <TableClusterType clusterId={cluster.id} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
