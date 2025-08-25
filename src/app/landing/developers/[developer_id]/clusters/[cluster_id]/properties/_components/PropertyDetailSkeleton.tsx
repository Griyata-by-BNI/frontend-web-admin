"use client";

import { Col, Row, Skeleton } from "antd";
import React from "react";

const SkeletonTag = ({ className = "" }: { className?: string }) => (
  <div
    className={`inline-block h-6 w-28 rounded-full bg-gray-200 ${className}`}
  />
);

const SpecItemSkeleton = () => (
  <div className="flex items-center p-3 rounded-xl bg-teal-50/60 border border-teal-100">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100" />
    <div className="ml-3 flex-1">
      <div className="h-4 w-40 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function PropertyDetailSkeleton() {
  return (
    <div className="w-full custom-container">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50 border border-gray-200 shadow-lg shadow-gray-500/10 p-6 md:p-10 mb-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <span className="mx-1">/</span>
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <span className="mx-1">/</span>
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <span className="mx-1">/</span>
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            <Skeleton
              active
              title={{ width: "60%" }}
              paragraph={{ rows: 0 }}
              className="!mb-2"
            />
            {/* Lokasi */}
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />

            {/* Chips */}
            <div className="mt-2 flex flex-wrap gap-2">
              <SkeletonTag />
              <SkeletonTag className="w-24" />
            </div>
          </div>

          {/* Developer logo card */}
          <div className="w-full lg:w-[320px]">
            <div className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="h-20 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
      </div>

      {/* Main Content */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left */}
        <div className="lg:col-span-2">
          {/* Image Slider */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-8">
            <div className="relative w-full h-80 md:h-[420px] bg-gray-100" />
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
            <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
            <Skeleton active paragraph={{ rows: 3 }} title={false} />
          </div>

          {/* Specifications */}
          <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
            <div className="h-6 w-36 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SpecItemSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* KPR Simulator */}
          <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Skeleton
                  active
                  paragraph={{ rows: 6 }}
                  title={{ width: "50%" }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Skeleton
                  active
                  paragraph={{ rows: 6 }}
                  title={{ width: "40%" }}
                />
                <div className="mt-4 h-10 w-full bg-gray-200 rounded-full" />
              </Col>
            </Row>
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
            <div className="h-6 w-64 bg-gray-200 rounded mb-4" />
            <div className="h-72 w-full bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Right - Sticky */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="sticky top-20 space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-fit border border-gray-200 p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-4 bg-gray-400" />
              <div className="mt-5 space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-8 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="my-4 border-t border-gray-200" />
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-56 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-400" />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-full" />
              <div className="h-12 w-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
