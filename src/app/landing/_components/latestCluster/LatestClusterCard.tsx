import { LatestCluster } from "@/types/cluster";
import calculateInstallment from "@/utils/calculateInstallment";
import formatPrice from "@/utils/formatPrice";
import { Carousel } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=60&auto=format";

interface LatestClusterCardProps {
  cluster: LatestCluster;
}

const LatestClusterCard: React.FC<LatestClusterCardProps> = ({ cluster }) => {
  const devId = cluster.developerId;

  const href = useMemo(
    () => `/developers/${devId}/clusters/${cluster.id}`,
    [devId, cluster.id]
  );

  const images = cluster.cluster_photo_urls?.length
    ? cluster.cluster_photo_urls
    : [FALLBACK_IMAGE];

  const installment = useMemo(
    () => calculateInstallment(cluster.minPrice),
    [cluster.minPrice]
  );

  // gunakan aspect ratio agar layout stabil untuk Image fill
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`Lihat detail cluster ${cluster.name}`}
      className="flex"
    >
      <article
        className="bg-white rounded-2xl shadow-xl shadow-gray-500/10 overflow-hidden border
        border-gray-200 hover:border-primary-tosca hover:shadow-gray-500/20 flex flex-col w-full transition"
      >
        {/* IMAGE AREA */}
        <div className="relative w-full aspect-[16/9] bg-gray-100">
          {images.length > 1 ? (
            <Carousel
              autoplay
              autoplaySpeed={4500}
              pauseOnHover
              waitForAnimate
              dots
              className="h-full [&_.slick-prev]:left-2 [&_.slick-next]:right-2
                         [&_.slick-prev]:z-20 [&_.slick-next]:z-20 [&_.slick-prev]:bg-black/50
                         [&_.slick-next]:bg-black/50 [&_.slick-prev]:rounded-full
                         [&_.slick-next]:rounded-full [&_.slick-prev]:w-8 [&_.slick-next]:w-8
                         [&_.slick-prev]:h-8 [&_.slick-next]:h-8 [&_.slick-dots]:z-20"
            >
              {images.map((src, idx) => (
                <div
                  key={`${cluster.id}-${idx}`}
                  className="relative w-full aspect-[16/9]"
                >
                  <Image
                    src={src}
                    alt={`${cluster.name} - foto ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <Image
              src={images[0]}
              alt={cluster.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-teal-700 line-clamp-2">
            {cluster.name}
          </h3>

          <p className="text-base text-teal-600/90 mb-4 line-clamp-2">
            {cluster.address || "Lokasi tidak tersedia"}
          </p>

          <div className="mt-auto flex items-center pt-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Harga mulai dari</p>
              <p className="text-base font-bold text-gray-800 mt-1 truncate">
                <span className="font-normal text-sm">Rp</span>{" "}
                {formatPrice(cluster.minPrice)}
              </p>
            </div>

            <div className="h-10 w-px bg-gray-200 mx-3" aria-hidden />

            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Angsuran mulai dari</p>
              <p className="text-base font-bold text-gray-800 mt-1 truncate">
                {installment}
                <span className="text-sm text-gray-500 font-normal">
                  {" "}
                  /bulan
                </span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default LatestClusterCard;
