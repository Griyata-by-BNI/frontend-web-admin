"use client";

import { useDetailDeveloper } from "@/services/developerServices";
import "@ant-design/v5-patch-for-react-19";
import { Breadcrumb, Col, Row } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import DeleteDeveloperModal from "../_components/DeleteDeveloperModal";
import EditDeveloperModal from "../_components/EditDeveloperModal";
import SkeletonDetailDeveloper from "./_components/SkeletonDetailDeveloper";
import TableCluster from "./_components/TableCluster";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = parseInt(params.developer_id as string);

  const router = useRouter();

  const { data, status } = useDetailDeveloper(developerId);
  const developer = data?.data?.developer;

  if (status === "pending") {
    return <SkeletonDetailDeveloper />;
  }

  if (!developer) {
    return <div>Developer not found</div>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-2xl text-primary-black font-bold">
          {developer.name}
        </p>

        <Breadcrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Developer Management",
              onClick: () => router.push("/admin/developer-management"),
            },
            {
              title: (
                <p className="text-dark-tosca font-semibold">
                  {developer.name}
                </p>
              ),
            },
          ]}
        />

        <div className="mt-4 overflow-hidden">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="w-full h-[200px] rounded-lg">
                <Image
                  key={`${developer.developerPhotoUrl}-${developer.updatedAt}`}
                  src={`${developer.developerPhotoUrl}?t=${new Date(
                    developer.updatedAt
                  ).getTime()}`}
                  width={200}
                  height={200}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Col>

            <Col xs={24} md={16}>
              <div className="flex gap-2 justify-end">
                <EditDeveloperModal developerData={developer} />

                <DeleteDeveloperModal developerData={developer} />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold text-primary-black">
                  Deskripsi
                </p>

                <p className="text-primary-black text-justify">
                  {developer.description}
                </p>
              </div>
            </Col>

            <Col span={24}>
              <p className="text-lg font-bold text-primary-black mb-1">
                Daftar Cluster
              </p>

              <TableCluster />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
