// app/(debtor)/developers/[developer_id]/clusters/[cluster_id]/page.tsx
"use client";

import ImageSlider from "@/app/(debtor)/developers/components/ImageSlider";
import { MapWithNearbyPlaces } from "@/app/(debtor)/developers/components/Map";
import { useClusterById } from "@/services/clusterServices";
import { useClusterTypes } from "@/services/clusterTypeServices";
import { useDetailDeveloper } from "@/services/developerServices";
import { usePropertiesByClusterType } from "@/services/propertyServices";
import formatPrice from "@/utils/formatPrice";
import {
  faBuilding,
  faBus,
  faChild,
  faChurch,
  faCoffee,
  faDumbbell,
  faHospital,
  faMosque,
  faPlane,
  faRunning,
  faSchool,
  faShieldAlt,
  faShoppingBag,
  faShoppingCart,
  faStore,
  faSwimmingPool,
  faTrain,
  faTree,
  faUsers,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Building } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import StickyCard from "../_components/StickyCard";
import PropertyCard from "@/app/landing/search/_components/PropertyCard";
import LatestClusterCardSkeleton from "@/app/landing/_components/latestCluster/LatestClusterCardSkeleton";

export interface Facility {
  name: "KT" | "KM" | "LB" | "LT";
  value: number;
}

interface PropertyCardShape {
  id: number;
  developerId: number;
  clusterId: number;
  location: string;
  propertyName: string;
  developerName: string;
  price: number;
  installment?: number;
  facilities: Facility[];
  updatedAt: string;
  photoUrl: string;
  clusterTypeName: string;
}

// ==============================
// LIST & ITEM TIPE PROPERTI
// ==============================
const PropertyTypesList = ({
  propertyTypes,
  clusterDetail,
}: {
  propertyTypes: any[];
  clusterDetail: any;
}) => {
  if (!propertyTypes?.length) return null;

  return (
    <section
      id="tipe"
      className="mb-8 bg-white p-6 rounded-2xl shadow-lg shadow-gray-500/10 border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        {/* <Building className="w-6 h-6 text-primary-tosca" /> */}

        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Tipe Properti
        </h2>
      </div>

      <div className="space-y-6">
        {propertyTypes.map((type) => (
          <PropertyTypeItem
            key={type.id}
            type={type}
            clusterDetail={clusterDetail}
          />
        ))}
      </div>
    </section>
  );
};

const PropertyTypeItem = ({
  type,
  clusterDetail,
}: {
  type: any;
  clusterDetail: any;
}) => {
  const { data, isLoading } = usePropertiesByClusterType(type.id);
  const properties = useMemo(() => data?.data || [], [data]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1/2">
              <LatestClusterCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!properties?.length) return null;

  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white relative">
      <h3 className="text-lg font-bold text-dark-tosca mb-3">{type.name}</h3>

      <div className="flex gap-4 max-w-full overflow-x-auto overflow-y-visible pb-4 -mb-2 relative z-10 no-scrollbar">
        {properties.map((prop: any) => {
          const rawFacilities: Facility[] = [
            { name: "KT", value: prop.jumlahKamarTidur || 0 },
            { name: "KM", value: prop.jumlahKamarMandi || 0 },
            { name: "LB", value: prop.buildingArea || 0 },
            { name: "LT", value: prop.landArea || 0 },
          ];

          const propertyForCard: PropertyCardShape = {
            id: prop.propertyId,
            propertyName: prop.name,
            developerId: clusterDetail.developerId,
            clusterId: clusterDetail.id,
            location: clusterDetail.address || prop.location || "N/A",
            developerName: clusterDetail.developerName,
            price: Number(prop.price) || 0,
            facilities: rawFacilities.filter((f) => f.value > 0),
            updatedAt: prop.updated_at,
            photoUrl: prop.property_photo_urls?.[0] || null,
            clusterTypeName: type.name,
          };

          return (
            <div
              key={`${type.id}-${prop.propertyId}`}
              className="w-1/2 relative z-10"
            >
              {/* pastikan komponen kartu mengisi lebar wrapper */}
              <PropertyCard property={propertyForCard} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==============================
// HALAMAN DETAIL CLUSTER
// ==============================
export default function HousingDetailPage() {
  const params = useParams();
  const developerId = params.developer_id as string;
  const clusterId = params.cluster_id as string;

  const {
    data: cluster,
    isLoading: clusterLoading,
    error: clusterError,
  } = useClusterById(clusterId, true);
  const { data: clusterTypesData, isLoading: typesLoading } = useClusterTypes(
    clusterId,
    !!cluster
  );
  const { data: developer, isLoading: developerLoading } = useDetailDeveloper(
    Number(developerId)
  );

  const clusterDetail = cluster?.data?.clusters?.[0];
  const propertyTypes = clusterTypesData?.data?.clusterTypes || [];

  if (clusterLoading || typesLoading || developerLoading) {
    return (
      <div className="min-h-screen py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (clusterError || !clusterDetail || !developer) {
    return (
      <div className="min-h-screen py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Gagal memuat data cluster</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const facilityIcons: Record<string, any> = {
    masjid: faMosque,
    gereja: faChurch,
    cafe: faCoffee,
    "ruang komunitas": faUsers,
    school: faSchool,
    hospital: faHospital,
    "grocery store": faShoppingBag,
    minimarket: faStore,
    "halte bus": faBus,
    gym: faDumbbell,
    stasiun: faTrain,
    bandara: faPlane,
    security: faShieldAlt,
    "swimming pool": faSwimmingPool,
    "kolam renang": faSwimmingPool,
    "outdoor playground": faChild,
    "club house": faBuilding,
    "jogging track": faRunning,
    restoran: faUtensils,
    mall: faShoppingCart,
    taman: faTree,
  };

  const facilities =
    (clusterDetail.facilities || "")
      .split(",")
      .map((f: string) => f.trim().toLowerCase())
      .map((name: string) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        icon: facilityIcons[name],
      }))
      .filter((f) => f.icon && f.name) || [];

  const areCoordinatesValid =
    clusterDetail.latitude &&
    clusterDetail.longitude &&
    !isNaN(Number(clusterDetail.latitude)) &&
    !isNaN(Number(clusterDetail.longitude));

  const developerLogo =
    developer?.data?.developer?.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Logo";

  return (
    <div className="min-h-screen bg-light-tosca">
      <main className="custom-container">
        {/* ===== Hero ===== */}
        <div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50
        border border-gray-200 shadow-lg shadow-gray-500/10 p-6 md:p-10 mb-8"
        >
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

              {/* Badges ringkas */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20
                 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca"
                >
                  Harga {formatPrice(clusterDetail.minPrice)} –{" "}
                  {formatPrice(clusterDetail.maxPrice)}
                </span>

                <span
                  className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20
                 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca"
                >
                  {propertyTypes.length} tipe tersedia
                </span>
              </div>
            </div>

            {/* Kartu logo developer */}
            <div className="w-full lg:w-[320px]">
              <div className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-teal-100/60 pointer-events-none" />
                <div className="flex items-center justify-center">
                  {/* pakai <img> agar simpel di sini */}
                  {/* atau pakai next/image jika mau optimization */}
                  <img
                    src={developerLogo}
                    alt="Developer Logo"
                    className="h-16 md:h-20 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative blob */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
        </div>

        {/* ===== Konten Utama ===== */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kiri */}
          <div className="lg:col-span-2">
            {/* Slider Foto */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-8">
              <div className="relative w-full h-80 md:h-[420px]">
                <ImageSlider
                  urls={clusterDetail.cluster_photo_urls}
                  altText={clusterDetail.name}
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Deskripsi
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {clusterDetail.description}
              </p>
            </div>

            {/* Tipe Properti */}
            <div className="mb-6">
              <PropertyTypesList
                propertyTypes={propertyTypes}
                clusterDetail={clusterDetail}
              />
            </div>

            {/* Fasilitas */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 mb-6 shadow-lg shadow-gray-500/10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Fasilitas Umum
              </h2>
              {facilities.length ? (
                <div className="flex flex-wrap gap-3">
                  {facilities.map((f) => (
                    <span
                      key={f.name}
                      className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 px-3 py-1.5 text-sm text-gray-700 shadow-sm"
                    >
                      <FontAwesomeIcon
                        icon={f.icon}
                        className="w-4 h-4 text-teal-600"
                      />
                      {f.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Fasilitas tidak tersedia.</p>
              )}
            </div>

            {/* Peta */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-lg shadow-gray-500/10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Lokasi & Tempat Terdekat
              </h2>
              {areCoordinatesValid ? (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <MapWithNearbyPlaces
                    center={[
                      Number(clusterDetail.latitude),
                      Number(clusterDetail.longitude),
                    ]}
                    popupText={`Lokasi ${clusterDetail.name}`}
                    nearbyPlaces={
                      Array.isArray(clusterDetail.nearbyPlaces)
                        ? clusterDetail.nearbyPlaces
                        : []
                    }
                  />
                </div>
              ) : (
                <p className="text-gray-500">Peta lokasi tidak tersedia.</p>
              )}
            </div>
          </div>

          {/* Kanan (Sticky) */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <StickyCard
              priceLabel="Harga mulai dari"
              price={`${formatPrice(clusterDetail.minPrice)} - ${formatPrice(
                clusterDetail.maxPrice
              )}`}
              minPrice={clusterDetail.minPrice}
              developerName={clusterDetail.developerName}
              location={clusterDetail.address || "Alamat tidak tersedia"}
              developerPhotoUrl={developerLogo}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
