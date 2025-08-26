"use client";

import { useLatestClusters } from "@/services";
import { Carousel, Col, Empty, Grid, Row } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";
import LatestClusterCard from "./LatestClusterCard";
import LatestClusterCardSkeleton from "./LatestClusterCardSkeleton";

const { useBreakpoint } = Grid;

export default function LatestClusterSection() {
  const { data, isLoading } = useLatestClusters();

  const screens = useBreakpoint();
  const isMobile = !screens.md; // < md = mobile

  const latestClusterData = useMemo(() => {
    return data?.data?.clusters?.slice(0, 4) ?? [];
  }, [data]);

  const SKELETON_COUNT = 4;

  // Carousel ref untuk kontrol panah
  const carouselRef = useRef<CarouselRef | null>(null);

  const slidesLength = isLoading ? SKELETON_COUNT : latestClusterData.length;
  const showArrows = isMobile && slidesLength > 1;

  return (
    <section className="space-y-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary-black">
        Cluster Terbaru
      </h2>

      {/* Mobile: Slider + arrows */}
      {isMobile ? (
        <div className="relative">
          {showArrows && (
            <>
              <button
                type="button"
                aria-label="Sebelumnya"
                onClick={() => carouselRef.current?.prev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2 hover:shadow-md transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Berikutnya"
                onClick={() => carouselRef.current?.next()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2 hover:shadow-md transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {isLoading ? (
            <Carousel
              ref={carouselRef}
              dots
              draggable
              infinite={SKELETON_COUNT > 1}
              className="overflow-hidden"
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <div key={`skeleton-slide-${idx}`} className="px-1">
                  <LatestClusterCardSkeleton />
                </div>
              ))}
            </Carousel>
          ) : slidesLength > 0 ? (
            <Carousel
              ref={carouselRef}
              dots
              draggable
              infinite={slidesLength > 1}
              className="overflow-hidden"
            >
              {latestClusterData.map((cluster) => (
                <div key={cluster.id} className="px-1">
                  <LatestClusterCard cluster={cluster} />
                </div>
              ))}
            </Carousel>
          ) : (
            <Empty description="Belum ada data cluster" />
          )}
        </div>
      ) : (
        // Desktop: Grid
        <Row gutter={[24, 24]}>
          {isLoading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <Col key={`skeleton-${idx}`} xs={24} md={6}>
                <LatestClusterCardSkeleton />
              </Col>
            ))
          ) : latestClusterData.length > 0 ? (
            latestClusterData.map((cluster) => (
              <Col key={cluster.id} xs={24} md={6}>
                <LatestClusterCard cluster={cluster} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty description="Belum ada data cluster" />
            </Col>
          )}
        </Row>
      )}
    </section>
  );
}
