"use client";

import FavoriteButton from "@/app/(debtor)/developers/components/FavoriteButton";
import ImageSlider from "@/app/(debtor)/developers/components/ImageSlider";
import { MapWithNearbyPlaces } from "@/app/(debtor)/developers/components/Map";
import { KPRSimulator } from "@/app/(debtor)/kpr-simulator";
import { useAuth } from "@/contexts/authContext";
import { usePropertyById } from "@/services/propertyServices";
import { axiosInstance } from "@/utils/axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import calculateInstallment from "@/utils/calculateInstallment";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBed,
  faChartArea,
  faHouse,
  faShower,
  faStairs,
  faSwimmingPool,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { useClusterById } from "@/services";
import { useDetailDeveloper } from "@/services/developerServices";
import StickyCard from "../../../_components/StickyCard";
import { Tooltip } from "antd";

interface Specification {
  text: string;
  icon: IconDefinition;
}

const parseSpecifications = (property: any): Specification[] => {
  const specs: Specification[] = [];

  if (property.jumlahKamarTidur)
    specs.push({
      text: `${property.jumlahKamarTidur} Kamar Tidur`,
      icon: faBed,
    });
  if (property.jumlahKamarMandi)
    specs.push({
      text: `${property.jumlahKamarMandi} Kamar Mandi`,
      icon: faShower,
    });
  if (property.luasTanah)
    specs.push({
      text: `Luas Tanah ${property.luasTanah} m²`,
      icon: faChartArea,
    });
  if (property.luasBangunan)
    specs.push({
      text: `Luas Bangunan ${property.luasBangunan} m²`,
      icon: faHouse,
    });
  if (property.jumlahLantai)
    specs.push({ text: `${property.jumlahLantai} Lantai`, icon: faStairs });
  if (property.garasi) specs.push({ text: "Garasi", icon: faWarehouse });
  if (property.kolamRenang)
    specs.push({ text: "Kolam Renang", icon: faSwimmingPool });

  return specs;
};

export default function DetailPropertyPage() {
  const { user } = useAuth();
  const params = useParams();
  const propertyId = Number(params.property_id);
  const clusterId = String(params.cluster_id);
  const developerId = Number(params.developer_id);

  const { data, isLoading, error } = usePropertyById(propertyId);
  const {
    data: dataCluster,
    isLoading: clusterLoading,
    error: clusterError,
  } = useClusterById(clusterId, true);

  const {
    data: dataDeveloper,
    isLoading: developerLoading,
    error: developerError,
  } = useDetailDeveloper(developerId);

  const cluster = useMemo(() => {
    return dataCluster?.data?.clusters?.[0];
  }, [dataCluster]);

  const developer = useMemo(() => {
    return dataDeveloper?.data?.developer;
  }, [dataDeveloper]);

  const property = useMemo(() => {
    return data?.data;
  }, [data]);

  const installment = useMemo(() => {
    return calculateInstallment(property?.price) || 0;
  }, [property]);

  useEffect(() => {
    if (user && propertyId) {
      axiosInstance
        .post("/properties/recently-viewed-properties", {
          userId: parseInt(user.userId),
          propertyId,
        })
        .catch(console.error);
    }
  }, [user, propertyId]);

  if (isLoading || clusterLoading) {
    return (
      <div className="min-h-screen bg-light-tosca flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail properti...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-light-tosca flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Properti tidak ditemukan</p>
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

  const specifications = parseSpecifications(property);

  const areCoordinatesValid =
    property.latitude &&
    property.longitude &&
    !isNaN(Number(property.latitude)) &&
    !isNaN(Number(property.longitude));

  const developerLogo =
    developer?.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Logo";

  return (
    <div className="min-h-screen bg-light-tosca">
      <main className="custom-container">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50 border border-gray-200 shadow-lg shadow-gray-500/10 p-6 md:p-10 mb-8">
          <nav className="text-sm text-gray-500 mb-3">
            <Link
              href="/landing/developers"
              className="!text-gray-500 hover:!text-primary-purple"
            >
              Developers
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/landing/developers/${developerId}`}
              className="!text-gray-500 hover:!text-primary-purple"
            >
              {property.developerName}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/landing/developers/${developerId}/clusters/${clusterId}`}
              className="!text-gray-500 hover:!text-primary-purple"
            >
              {cluster?.name || "Cluster"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary-tosca font-semibold">
              {property.name}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                {property.name}
              </h1>
              <p className="mt-2 text-gray-600">
                {property.location || "Lokasi tidak tersedia"}
                {"  -  "}
                {property.collateralAddress || ""}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-tosca/20 px-3 py-1 text-sm font-semibold text-dark-tosca border border-primary-tosca">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    Number(property.price)
                  )}
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

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Image Slider */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-8">
              <div className="relative w-full h-80 md:h-[420px]">
                <ImageSlider
                  urls={property.property_photo_urls || []}
                  altText={property.name}
                />
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Deskripsi
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Spesifikasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec: Specification, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-3 rounded-xl bg-teal-50 border border-teal-100"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={spec.icon}
                        className="text-teal-600 w-5 h-5"
                      />
                    </div>
                    <span className="ml-3 text-gray-800 font-medium">
                      {spec.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPR Simulator */}
            <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Simulasi KPR
              </h2>
              <KPRSimulator
                initialPropertyPrice={Number(property.price)}
                size="small"
              />
            </div>

            {/* Location & Map */}
            <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Lokasi & Tempat Terdekat
              </h2>
              {areCoordinatesValid ? (
                <div className="rounded-xl overflow-hidden">
                  <MapWithNearbyPlaces
                    center={[
                      Number(property.latitude),
                      Number(property.longitude),
                    ]}
                    popupText={`Lokasi ${property.name}`}
                    nearbyPlaces={cluster?.nearbyPlaces ?? []}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Peta lokasi tidak tersedia.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Card */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-20 space-y-4">
              <StickyCard
                priceLabel="Harga"
                price={`${Intl.NumberFormat("id-ID").format(
                  Number(property.price) || 0
                )}`}
                minPrice={property.price}
                stock={property.stock}
                developerName={property.developerName}
                location={property.collateralAddress || "Alamat tidak tersedia"}
                developerPhotoUrl={developerLogo}
              />

              <div className="flex gap-3">
                <Link
                  href={`/kpr-apply?property_id=${propertyId}`}
                  className="flex-1"
                >
                  <button
                    className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-lg
                  font-semibold rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
                  >
                    Ajukan KPR
                  </button>
                </Link>

                {user?.userId && (
                  <FavoriteButton
                    propertyId={property.id}
                    userId={Number(user.userId)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
