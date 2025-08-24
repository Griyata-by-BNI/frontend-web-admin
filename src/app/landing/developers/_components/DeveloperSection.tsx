import { useClustersByDeveloper } from "@/services";
import Image from "next/image";
import Link from "next/link";
import ClusterCard from "./ClusterCard";
import LatestClusterCardSkeleton from "../../_components/latestCluster/LatestClusterCardSkeleton";

export default function DeveloperSection({ developer }: { developer: any }) {
  const { data: clustersData, isLoading: isClustersLoading } =
    useClustersByDeveloper(developer.id.toString());
  const clusters = clustersData?.data?.clusters || [];

  const logoUrl =
    developer.developerPhotoUrl ||
    `https://via.placeholder.com/120x60.png?text=${developer.name.replace(
      /\s/g,
      "+"
    )}`;

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex items-start gap-4 sm:flex-1">
          <Image
            src={logoUrl}
            alt={`${developer.name} logo`}
            width={100}
            height={100}
            className="object-contain rounded-md bg-white"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {developer.name}
            </h2>
            <p className="text-gray-600 max-w-4xl">{developer.description}</p>

            {/* Link mobile: di bawah deskripsi */}
            <Link
              href={`/landing/developers/${developer.id}`}
              className="block md:!hidden mt-3 items-center !text-primary-tosca hover:!text-dark-tosca transition-all font-semibold hover:underline"
            >
              Lihat lebih lengkap
            </Link>
          </div>
        </div>

        {/* Link desktop/tablet: tetap di kanan */}
        <Link
          href={`/landing/developers/${developer.id}`}
          className="hidden md:block !text-primary-tosca hover:!text-dark-tosca transition-all font-semibold hover:underline flex-shrink-0"
        >
          Lihat lebih lengkap
        </Link>
      </div>

      {isClustersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <LatestClusterCardSkeleton key={index} />
          ))}
        </div>
      ) : clusters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.slice(0, 3).map((cluster: any) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              developerId={developer.id}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
