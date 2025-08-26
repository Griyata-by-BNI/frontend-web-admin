import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "antd";
import formatPrice from "@/utils/formatPrice";
import calculateInstallment from "@/utils/calculateInstallment";

// =================================================================
// INTERFACE & PROPS
// =================================================================
interface ApiCluster {
  id: number;
  developerId: number;
  name: string;
  address: string | null;
  minPrice: string | null;
  cluster_photo_urls: string[];
}

interface ClusterCardProps {
  cluster: ApiCluster;
  developerId: number;
}

// =================================================================
// KOMPONEN UTAMA
// =================================================================
const ClusterCard: React.FC<ClusterCardProps> = ({ cluster, developerId }) => {
  const href = ` /developers/${developerId}/clusters/${cluster.id}`;

  const imageUrl =
    cluster.cluster_photo_urls?.[0] ||
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";

  const installment = useMemo(() => {
    return calculateInstallment(cluster.minPrice);
  }, [cluster.minPrice]);

  return (
    // ✨ Mengubah Link agar tidak memiliki h-full
    <Link href={href} className="flex">
      {/* ✨ Mengubah rounded-lg menjadi rounded-2xl */}
      <div
        className="bg-white rounded-2xl shadow-xl shadow-gray-500/10 overflow-hidden border border-gray-200
       hover:border-primary-tosca hover:shadow-gray-500/20 flex flex-col w-full transition-all duration-300"
      >
        {/* GAMBAR: Slightly reduced height */}
        <div className="relative w-full h-44 bg-gray-100">
          {cluster.cluster_photo_urls &&
          cluster.cluster_photo_urls.length > 0 ? (
            <div className="h-full relative z-10">
              <Carousel
                autoplay
                dots
                className="h-full [&_.slick-prev]:left-2 [&_.slick-next]:right-2
                [&_.slick-prev]:z-20 [&_.slick-next]:z-20 [&_.slick-prev]:bg-black/50
                [&_.slick-next]:bg-black/50 [&_.slick-prev]:rounded-full
                [&_.slick-next]:rounded-full [&_.slick-prev]:w-8 [&_.slick-next]:w-8
                [&_.slick-prev]:h-8 [&_.slick-next]:h-8 [&_.slick-dots]:z-20"
              >
                {cluster.cluster_photo_urls.map((src, idx) => (
                  <div key={idx} className="relative w-full h-44">
                    <Image
                      src={src}
                      alt={`cluster-photo-${idx + 1}`}
                      objectFit="cover"
                      width={100}
                      height={100}
                      className="w-full h-full"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={cluster.name}
              objectFit="cover"
              width={100}
              height={100}
              className="w-full h-full"
            />
          )}
        </div>

        {/* KONTEN: Slightly reduced padding */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Judul: Smaller font */}
          <h3 className="text-lg font-bold text-primary-black">
            {cluster.name}
          </h3>

          {/* Alamat: Increased font size and margin */}
          <p className="text-base text-gray-500 mb-2">
            {cluster.address || "Lokasi tidak tersedia"}
          </p>

          {/* HARGA & ANGSURAN: Increased padding */}
          <div className="mt-auto flex items-center pt-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Harga mulai dari</p>
              {/* Smaller price font size */}
              <p className="text-xl font-extrabold text-primary-tosca mt-1">
                <span>Rp</span> {formatPrice(cluster.minPrice)}
              </p>
            </div>

            {/* Slightly smaller divider */}
            <div className="h-10 w-px bg-gray-200 mx-3"></div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">Angsuran mulai dari</p>
              {/* Smaller installment font size */}
              <p className="text-xl font-extrabold text-primary-tosca mt-1">
                {installment}
                <span className="text-sm text-gray-700 font-normal">
                  {" "}
                  /bulan
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClusterCard;
