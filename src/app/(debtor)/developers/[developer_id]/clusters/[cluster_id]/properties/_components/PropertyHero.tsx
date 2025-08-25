"use client";

import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { Cluster, DetailCluster } from "@/types/cluster";
import { Developer } from "@/types/developer";
import { Property, PropertyDetail } from "@/types/property";

interface PropertyHeroProps {
  property: PropertyDetail;
  developer: Developer | undefined;
  cluster: DetailCluster | undefined;
  developerId: number;
  clusterId: string;
}

export default function PropertyHero({
  property,
  developer,
  cluster,
  developerId,
  clusterId,
}: PropertyHeroProps) {
  const developerLogo =
    developer?.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Logo";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50 border border-gray-200 shadow-lg shadow-gray-500/10 p-6 md:p-10 mb-8">
      <CustomBreadcrumb
        className="mb-3"
        items={[
          { label: "Partner Developer", href: " /developers" },
          {
            label: property.developerName,
            href: ` /developers/${developerId}`,
          },
          {
            label: cluster?.name || "Cluster",
            href: ` /developers/${developerId}/clusters/${clusterId}`,
          },
          { label: property.clusterTypeName + " - " + property.name },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            {property.clusterTypeName + " - " + property.name}
          </h1>
          <p className="mt-2 text-gray-600">
            {property.location || "Lokasi tidak tersedia"}
            {"  -  "}
            {property.collateralAddress || ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca">
              Rp {new Intl.NumberFormat("id-ID").format(Number(property.price))}
            </span>
            {property.stock && (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca">
                Stok: {property.stock} unit
              </span>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[320px]">
          <div className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-teal-100/60 pointer-events-none" />
            <div className="flex items-center justify-center">
              <img
                src={developerLogo}
                alt="Developer Logo"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
    </div>
  );
}
