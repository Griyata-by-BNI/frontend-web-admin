import { ExploreProperty } from "@/types/explore";
import calculateInstallment from "@/utils/calculateInstallment";
import formatPrice from "@/utils/formatPrice";
import getPropertyFacility from "@/utils/getPropertyFacility";
import getTimeAgo from "@/utils/getTimeAgo";
import { Col, Row } from "antd";
import { MapPin, Bed, Bath, Home, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const PropertyCard: React.FC<{ property: ExploreProperty }> = ({
  property,
}) => {
  const installment = useMemo(
    () => calculateInstallment(String(property.price)),
    [property.price]
  );

  return (
    <Link
      href={`/developers/${property.developerId}/clusters/${property.clusterId}/properties/${property.id}`}
      className="w-full bg-white rounded-2xl shadow-lg shadow-gray-500/10 overflow-hidden border border-gray-200
      hover:shadow-gray-500/20 hover:border-primary-tosca flex flex-col h-full"
    >
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={
            property.photoUrl ||
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
          }
          alt={property.propertyName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 200px"
        />
        {/* Time ago badge di kanan-atas di atas image */}
        <span className="absolute top-2 right-2 text-xs bg-white text-dark-tosca font-semibold px-3 py-1 rounded-full">
          {getTimeAgo(property.updatedAt)}
        </span>
      </div>

      <div className="p-5 bg-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-sm text-teal-700">
            <MapPin className="w-4 h-4" />
            <span className="ml-1">
              {property.location || "Lokasi tidak tersedia"}
            </span>

            {property.distanceKm && (
              <span className="ml-2 text-xs bg-light-tosca text-dark-tosca px-2 py-1 rounded-full">
                {property.distanceKm.toFixed(1)} km
              </span>
            )}
          </div>
          {/* badge time ago dipindah ke atas image, jadi elemen kanan ini dihapus */}
        </div>

        <h3
          className="text-xl font-bold text-gray-900 truncate"
          title={
            property.clusterTypeName
              ? `${property.clusterTypeName} - ${property.propertyName}`
              : property.propertyName
          }
        >
          {property.clusterTypeName
            ? `${property.clusterTypeName} - ${property.propertyName}`
            : property.propertyName}
        </h3>

        <p className="text-sm text-gray-500">{property.developerName}</p>

        <Row align="middle" gutter={[16, 0]} className="my-4 py-3">
          <Col span={8}>
            <p className="text-xs text-gray-500">Harga</p>
            <p className="text-xl font-extrabold text-primary-tosca">
              <span>Rp</span> {formatPrice(String(property.price ?? 0))}
            </p>
          </Col>

          <Col span={16} className="md:border-l md:pl-4 border-gray-200">
            <p className="text-xs text-gray-500">Angsuran mulai dari</p>
            <p className="text-xl font-extrabold text-primary-tosca">
              {installment}
              <span className="text-sm font-normal text-gray-900"> /bulan</span>
            </p>
          </Col>
        </Row>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-gray-500" />
            <span>KT: {getPropertyFacility(property, "KT")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" />
            <span>LB: {getPropertyFacility(property, "LB")} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-gray-500" />
            <span>KM: {getPropertyFacility(property, "KM")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-500" />
            <span>LT: {getPropertyFacility(property, "LT")} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
