"use client";

import "@ant-design/v5-patch-for-react-19";
import { Breadcrumb, Button, Col, Row } from "antd";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { mockDeveloperData } from "../constants";
import EditDeveloperModal from "../components/EditDeveloperModal";
import type { Developer } from "../types";
import TableCluster from "./components/TableCluster";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = params.developer_id as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const developer = mockDeveloperData.find((dev) => dev.id === developerId);

  const handleEditSubmit = (values: Developer) => {
    console.log("Updated values:", values);
    setIsEditModalOpen(false);
  };

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
              href: "/admin/developer-management",
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
          <Row gutter={[48, 24]}>
            <Col xs={24} md={8}>
              <div className="w-full h-[200px] rounded-lg">
                <Image
                  src={developer.image}
                  width={400}
                  height={200}
                  alt={developer.name}
                  className="w-full h-[200px] object-contain"
                />
              </div>
            </Col>

            <Col xs={24} md={16}>
              <div className="flex gap-2 justify-end">
                <Button
                  icon={<Edit className="w-4 h-4" />}
                  className="w-max"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit
                </Button>

                <Button
                  icon={<Trash className="w-4 h-4 stroke-red-500" />}
                  className="w-max"
                >
                  Delete
                </Button>
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
                List Cluster
              </p>

              <TableCluster />
            </Col>
          </Row>
        </div>
      </div>

      <EditDeveloperModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editingRecord={developer}
      />
    </>
  );
}
