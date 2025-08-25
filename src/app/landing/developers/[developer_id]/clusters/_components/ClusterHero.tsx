import Link from "next/link";
import formatPrice from "@/utils/formatPrice";

interface ClusterHeroProps {
  clusterDetail: any;
  propertyTypesCount: number;
  developerLogo: string;
  developerId: string;
}

export default function ClusterHero({
  clusterDetail,
  propertyTypesCount,
  developerLogo,
  developerId,
}: ClusterHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50 border border-gray-200 shadow-lg shadow-gray-500/10 p-6 md:p-10 mb-8">
      <nav className="text-sm text-gray-500 mb-3">
        <Link
          href="/developers"
          className="!text-gray-500 hover:!text-primary-purple"
        >
          Developers
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/landing/developers/${developerId}`}
          className="!text-gray-500 hover:!text-primary-purple"
        >
          {clusterDetail.developerName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary-tosca font-semibold">
          {clusterDetail.name}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            {clusterDetail.name}
          </h1>
          <p className="mt-2 text-gray-600">
            {clusterDetail.address || "Alamat tidak tersedia"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca">
              Harga {formatPrice(clusterDetail.minPrice)} –{" "}
              {formatPrice(clusterDetail.maxPrice)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca">
              {propertyTypesCount} tipe tersedia
            </span>
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