// components/RecentlyViewedCard.tsx
import { RecentlyViewedProperty } from "@/types/property";
import calculateInstallment from "@/utils/calculateInstallment";
import formatPrice from "@/utils/formatPrice";
import getTimeAgo from "@/utils/getTimeAgo";
import { Row, Col } from "antd";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const RecentlyViewedCard: React.FC<{ property: RecentlyViewedProperty }> = ({
  property,
}) => {
  const installment = useMemo(
    () => calculateInstallment(String(property.price ?? 0)),
    [property.price]
  );

  const title = property.clusterTypeName
    ? `${property.clusterTypeName} - ${property.propertyName}`
    : property.propertyName;

  return (
    <Link
      href={`/developers/${property.developerId}/clusters/${property.clusterId}/properties/${property.id}`}
      className="w-full !bg-white rounded-2xl shadow-lg shadow-gray-500/10 overflow-hidden border border-gray-200
      hover:shadow-gray-500/20 hover:border-primary-tosca flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={
            property.photoUrl ||
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
          }
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 200px"
        />

        {/* Time ago badge */}
        <span className="absolute top-2 right-2 text-[11px] bg-white/95 text-dark-tosca font-semibold px-3 py-1 rounded-full shadow-sm">
          Dilihat {getTimeAgo(property.lastViewed)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        {/* Judul */}
        <h3 className="text-xl font-bold text-gray-900 truncate" title={title}>
          {title}
        </h3>

        {/* Developer & Cluster */}
        <p className="text-sm text-gray-500">{property.location}</p>

        {/* Harga & Angsuran */}
        <Row align="middle" gutter={[16, 0]} className="my-4 py-3">
          <Col span={10}>
            <p className="text-xs text-gray-500">Harga</p>
            <p className="text-base md:text-lg font-extrabold text-primary-tosca">
              <span>Rp</span> {formatPrice(String(property.price ?? 0))}
            </p>
          </Col>

          <Col span={14} className="md:border-l md:pl-4 border-gray-200">
            <p className="text-xs text-gray-500">Angsuran mulai dari</p>
            <p className="text-base md:text-lg font-extrabold text-primary-tosca">
              {installment}
              <span className="text-sm font-normal text-gray-900"> /bulan</span>
            </p>
          </Col>
        </Row>

        {/* Chips informasi tambahan (opsional) */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-light-tosca/60 text-dark-tosca px-2 py-1 rounded-full">
            {property.developerName}
          </span>

          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {property.clusterName}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecentlyViewedCard;
