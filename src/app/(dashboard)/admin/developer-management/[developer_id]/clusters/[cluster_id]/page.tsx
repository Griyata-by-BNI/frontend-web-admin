"use client";

import { useClusterById } from "@/services";
import { Cluster, DetailCluster } from "@/types/cluster";
import "@ant-design/v5-patch-for-react-19";
import { Breadcrumb, Button, Col, Row, Tag } from "antd";
import { Edit, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import DeleteClusterModal from "../../_components/DeleteClusterModal";
import EditClusterModal from "../../_components/EditClusterModal";
import ClusterMap from "./_components/ClusterMap";
import ImageGallery from "./_components/ImageGallery";
import TableClusterType from "./_components/TableClusterType";

export default function ClusterDetailPage() {
  const params = useParams();
  const developerId = params.developer_id as string;
  const clusterId = params.cluster_id as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading } = useClusterById(clusterId as string);
  const cluster = data?.data?.clusters?.[0];

  const handleEditSubmit = (values: DetailCluster) => {
    console.log("Updated values:", values);
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting cluster:", cluster?.id);
    setIsDeleteModalOpen(false);
  };

  if (!cluster) {
    return <div>Cluster tidak ditemukan</div>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">{cluster.name}</p>

        <Breadcrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Developer Management",
              href: "/admin/developer-management",
            },
            {
              title: cluster.developerName,
              href: `/admin/developer-management/${developerId}`,
            },
            {
              title: (
                <p className="text-dark-tosca font-semibold">{cluster.name}</p>
              ),
            },
          ]}
        />

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

                <div className="flex gap-2 pb-2">
                  <Button
                    icon={<Edit className="w-4 h-4" />}
                    className="w-max"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit
                  </Button>

                  <DeleteClusterModal dataCluster={cluster} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-primary-black">{cluster.description}</p>
                </div>

                {cluster.minPrice && cluster.maxPrice && (
                  <Row gutter={16}>
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
                  </Row>
                )}

                <div>
                  <p className="text-lg font-bold text-primary-black mb-2">
                    Fasilitas
                  </p>

                  {cluster.facilities ? (
                    <div className="flex flex-wrap gap-1">
                      {cluster.facilities.split(", ").map((facility, index) => (
                        <Tag key={index}>{facility}</Tag>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </Col>

            <Col span={24}>
              <div>
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
            </Col>

            <Col span={24}>
              <div>
                <p className="text-lg font-bold text-primary-black mb-2">
                  Cluster Type
                </p>

                <TableClusterType clusterId={cluster.id} />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <EditClusterModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        clusterId={clusterId}
      />
    </>
  );
}
