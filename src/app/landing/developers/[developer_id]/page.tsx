"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "antd";
import { ChevronRight, ArrowLeft, Building2 } from "lucide-react";
import ClusterSearchWrapper from "./_components/ClusterSearchWrapper";
import { useDetailDeveloper } from "@/services/developerServices";
import DeveloperDetailSkeleton from "./_components/DetailDeveloperSkeleton";
import KprToolsSection from "../../_components/KprToolsSection";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = params.developer_id;
  const { data: developerData, isLoading: isDeveloperLoading } =
    useDetailDeveloper(Number(developerId));

  if (isDeveloperLoading) {
    return <DeveloperDetailSkeleton />;
  }

  // ===== Not Found =====
  if (!developerData?.data?.developer) {
    return (
      <div className="custom-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Developer tidak ditemukan
          </h1>
          <p className="text-gray-600">
            Developer yang Anda cari tidak tersedia.
          </p>
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke daftar developer
          </Link>
        </div>
      </div>
    );
  }

  const developer = developerData.data.developer;
  const logoUrl =
    developer.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Developer+Logo";

  return (
    <div className="custom-container min-h-screen py-8">
      <CustomBreadcrumb
        className="mb-3"
        items={[
          { label: "Parner Developer", href: "/landing/developers" },
          {
            label: developer.name,
          },
        ]}
      />

      {/* ===== Hero / Header ===== */}
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br
      from-teal-50 via-white to-indigo-50 shadow-lg shadow-gray-500/10 border border-gray-200 p-6 md:p-10"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Logo card */}

          <Image
            src={logoUrl}
            alt={`${developer.name} logo`}
            width={250}
            height={125}
            className="object-contain"
          />

          {/* Title + About + CTA */}
          <div className="w-full md:max-w-2/3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {developer.name}
            </h1>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {developer.description ||
                "Belum ada deskripsi untuk developer ini."}
            </p>
          </div>
        </div>

        {/* Decorative blob */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
      </div>

      {/* ===== Projects Section ===== */}
      <section id="proyek" className="mt-12">
        <ClusterSearchWrapper
          developerName={developer.name}
          developerId={developer.id}
        />
      </section>

      <section id="tools" className="mt-12">
        <KprToolsSection />
      </section>
    </div>
  );
}
