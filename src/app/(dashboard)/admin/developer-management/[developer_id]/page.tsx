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
import CreateClusterModal from "./_components/CreateClusterModal";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = parseInt(params.developer_id as string, 10);

  const router = useRouter();

  const { data, status } = useDetailDeveloper(developerId);
  const developer = data?.data?.developer;

  if (status === "pending") {
    return <SkeletonDetailDeveloper />;
  }

  if (!developer) {
    return <div className="p-4">Developer not found</div>;
  }

  return (
    <div className="mb-4 flex flex-col gap-3 px-3 sm:px-0">
      {/* Header: judul + breadcrumbs + actions */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl text-primary-black font-bold truncate">
            {developer.name}
          </p>

          {/* Breadcrumbs: bisa scroll horizontal di layar sempit */}
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Breadcrumb
              items={[
                { title: "Dashboard" },
                {
                  title: "Developer Management",
                  onClick: () => router.push("/admin/developer-management"),
                },
                {
                  title: (
                    <span className="text-dark-tosca font-semibold">
                      {developer.name}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Actions: wrap & urut rapi di mobile */}
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <EditDeveloperModal developerData={developer} />
          <DeleteDeveloperModal developerData={developer} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        <Row
          gutter={[
            { xs: 12, sm: 16, md: 24 }, // gutter horizontal responsif
            { xs: 12, sm: 16, md: 24 }, // gutter vertikal responsif
          ]}
        >
          {/* Foto developer */}
          <Col xs={24} md={8}>
            {/* Gunakan aspect ratio agar proporsional di berbagai ukuran */}
            <div className="relative w-full rounded-lg overflow-hidden aspect-[4/3] md:aspect-square bg-gray-100">
              <Image
                key={`${developer.developerPhotoUrl}-${developer.updatedAt}`}
                src={`${developer.developerPhotoUrl}?t=${new Date(
                  developer.updatedAt
                ).getTime()}`}
                alt={developer.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          </Col>

          {/* Deskripsi */}
          <Col xs={24} md={16}>
            <div className="flex flex-col gap-2">
              <p className="text-base sm:text-lg font-bold text-primary-black">
                Deskripsi
              </p>
              <p className="text-primary-black text-justify text-sm sm:text-base leading-relaxed break-words">
                {developer.description}
              </p>
            </div>
          </Col>

          {/* Daftar cluster + tombol buat cluster */}
          <Col span={24}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <p className="text-base sm:text-lg font-bold text-primary-black">
                Daftar Cluster
              </p>
              <div className="flex justify-start sm:justify-end">
                <CreateClusterModal />
              </div>
            </div>

            {/* Kalau tabel lebar, biar bisa geser di mobile */}
            <div className="w-full overflow-x-auto">
              <TableCluster />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
