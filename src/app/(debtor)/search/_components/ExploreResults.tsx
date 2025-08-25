"use client";

import { useFilterContext } from "@/contexts/filterContext";
import { useExploreProperties } from "@/services/exploreServices";
import { FilterState } from "@/types/explore";
import { Alert, Col, Empty, Pagination, Row, Spin } from "antd";
import { useMemo } from "react";
import PropertyCard from "./PropertyCard";
import LatestClusterCardSkeleton from "../../_components/latestCluster/LatestClusterCardSkeleton";

const DEFAULTS = {
  priceMax: 10_000_000_000,
  areaMax: 500,
  pageNumber: 1,
  pageSize: 12,
};

export default function ExploreResults() {
  const { searchParams, pathname, router } = useFilterContext();

  const getNum = (k: string) => {
    const v = searchParams.get(k);
    if (v === null || v.trim() === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const getStr = (k: string) => searchParams.get(k) ?? undefined;
  const getRange = (prefix: string): [number, number] | undefined => {
    const min = getNum(`${prefix}Min`);
    const max = getNum(`${prefix}Max`);
    if (min === undefined || max === undefined) return undefined;
    return [min, max];
  };

  const searchTerm = searchParams.get("search") ?? "";
  const sortBy = getStr("sortBy") ?? "latestUpdated";

  const price = getRange("price");
  const landArea = getRange("landArea");
  const buildingArea = getRange("buildingArea");

  const bedrooms = getNum("bedrooms") ?? 0;
  const bathrooms = getNum("bathrooms") ?? 0;
  const floors = getNum("floors") ?? 0;

  const lat = getNum("lat");
  const lng = getNum("lng");
  const userLocation =
    lat !== undefined && lng !== undefined ? { lat, lng } : null;

  const pageNumber = Math.max(1, getNum("pageNumber") ?? DEFAULTS.pageNumber);
  const pageSize = Math.max(1, getNum("pageSize") ?? DEFAULTS.pageSize);

  const filters: FilterState | null = useMemo(() => {
    const [pmin, pmax] = [price?.[0] ?? 0, price?.[1] ?? DEFAULTS.priceMax];
    const [lmin, lmax] = [
      landArea?.[0] ?? 0,
      landArea?.[1] ?? DEFAULTS.areaMax,
    ];
    const [bmin, bmax] = [
      buildingArea?.[0] ?? 0,
      buildingArea?.[1] ?? DEFAULTS.areaMax,
    ];
    return {
      price: { min: pmin, max: pmax },
      landArea: { min: lmin, max: lmax },
      buildingArea: { min: bmin, max: bmax },
      bedrooms,
      bathrooms,
      floors,
    };
  }, [price, landArea, buildingArea, bedrooms, bathrooms, floors]);

  const locationLoading = false;

  const { data, isFetching, isError, error } = useExploreProperties(
    searchTerm,
    sortBy,
    filters,
    userLocation,
    locationLoading,
    pageNumber,
    pageSize
  );

  const properties = data?.data?.properties ?? [];
  const totalItems = data?.pagination?.itemsTotal ?? 0;

  const needsLocation =
    sortBy === "closestDistance" && !userLocation && !locationLoading;

  const onPageChange = (page: number, size: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("pageNumber", String(page));
    next.set("pageSize", String(size));
    router.push(`${pathname}?${next.toString()}`);
  };

  const showSkeleton = isFetching && properties.length === 0;

  return (
    <section className="space-y-4">
      {needsLocation && (
        <Alert
          type="warning"
          showIcon
          message="Aktifkan akses lokasi untuk mengurutkan berdasarkan jarak terdekat."
        />
      )}

      {isError && (
        <Alert
          type="error"
          showIcon
          message={(error as Error).message || "Terjadi kesalahan"}
        />
      )}

      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
        Ditemukan {totalItems} properti yang sesuai
      </h2>

      {showSkeleton ? (
        <div className="overflow-hidden">
          <Row gutter={[24, 24]}>
            {Array.from({ length: 4 }).map((item, index) => (
              <Col key={index} xs={24} md={8} lg={6}>
                <LatestClusterCardSkeleton />
              </Col>
            ))}
          </Row>
        </div>
      ) : properties.length === 0 ? (
        <Empty description="Tidak ada properti yang cocok" />
      ) : (
        <>
          <div className="overflow-hidden">
            <Row gutter={[24, 24]}>
              {properties.map((property) => (
                <Col key={property.id} xs={24} md={8} lg={6}>
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>
          </div>

          <div className="flex justify-center mt-6">
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={totalItems}
              onChange={onPageChange}
            />
          </div>
        </>
      )}
    </section>
  );
}
