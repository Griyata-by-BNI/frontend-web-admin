"use client";

import { Card, Skeleton, Space } from "antd";

// ======================================================
// SKELETONS
// ======================================================
function BadgeSkeleton() {
  return <div className="h-7 w-40 rounded-full bg-gray-200" />;
}

function ClusterHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-6 md:p-10 mb-8">
      <div className="mb-3">
        <div className="flex gap-2 text-sm">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-3 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-3 bg-gray-200 rounded" />
          <div className="h-4 w-36 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <Skeleton
            active
            title={{ width: "60%" }}
            paragraph={{ rows: 2, width: ["90%", "70%"] }}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <BadgeSkeleton />
            <BadgeSkeleton />
          </div>
        </div>

        <div className="w-full lg:w-[320px]">
          <Card variant="outlined" className="rounded-2xl">
            <div className="flex items-center justify-center">
              <div className="h-16 md:h-20 w-40 bg-gray-200 rounded" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ImageSliderSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-8">
      <div className="relative w-full h-80 md:h-[420px]">
        <div className="absolute inset-0 bg-gray-100" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="h-2 w-10 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

function DescriptionSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
      <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  );
}

function PropertyTypesListSkeleton() {
  // grid cards placeholder
  return (
    <div className="mb-6">
      <div className="h-7 w-48 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-xl">
            <Space direction="vertical" className="w-full">
              <div className="h-40 w-full bg-gray-100 rounded-lg" />
              <Skeleton active title paragraph={{ rows: 2 }} />
              <div className="flex gap-2">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="h-6 w-16 bg-gray-200 rounded-full" />
                ))}
              </div>
            </Space>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FacilitiesSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 mb-6 shadow-lg shadow-gray-500/10">
      <div className="h-7 w-48 bg-gray-200 rounded mb-4" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 px-3 py-1.5 shadow-sm"
          >
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-lg shadow-gray-500/10">
      <div className="h-7 w-64 bg-gray-200 rounded mb-4" />
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <div className="h-72 w-full bg-gray-100" />
      </div>
    </div>
  );
}

function StickyCardSkeleton() {
  return (
    <div className="lg:col-span-1 mt-8 lg:mt-0">
      <Card className="rounded-2xl">
        <div className="space-y-3">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-8 w-56 bg-gray-200 rounded" />
          <div className="h-4 w-44 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </Card>
    </div>
  );
}

export default function ClusterDetailSkeleton() {
  return (
    <div className="min-h-screen bg-light-tosca">
      <main className="custom-container">
        <ClusterHeroSkeleton />
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <ImageSliderSkeleton />
            <DescriptionSkeleton />
            <PropertyTypesListSkeleton />
            <FacilitiesSkeleton />
            <MapSkeleton />
          </div>
          <StickyCardSkeleton />
        </div>
      </main>
    </div>
  );
}
