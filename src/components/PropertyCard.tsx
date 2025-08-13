import Image from 'next/image';
import Link from 'next/link'; // 1. Impor Link dari Next.js
import React from 'react';
import { Property } from '@/types/developer';

// Ganti dengan path icon Anda atau gunakan library seperti lucide-react
const PriceTagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l9.29-9.29a1 1 0 0 0 0-1.42z"/><path d="M7 7h.01"/></svg>;
const InstallmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;


interface PropertyCardProps {
  property: Property;
  developerId: string; // 2. Tambahkan prop developerId
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, developerId }) => {
  // 3. Tentukan URL tujuan. Kita asumsikan property.id adalah ID untuk cluster.
  const href = `/developers/${developerId}/clusters/${property.id}`;

  return (
    // 4. Bungkus seluruh div dengan komponen Link
    <Link href={href} className="flex">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col w-full">
        <div className="relative w-full h-48">
          <Image
            src={property.imageUrl}
            alt={property.name}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-teal-700">{property.name}</h3>
          <p className="text-base text-teal-600/90 mt-1 mb-5">{property.location}</p>
          
          <div className="mt-auto flex items-center">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Harga mulai dari</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                <span className="font-normal text-base">Rp</span> {property.price}
              </p>
            </div>
            <div className="h-10 w-px bg-gray-200 mx-4"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Angsuran mulai dari</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                <span className="font-normal text-base">Rp</span> {property.installment}
                <span className="text-xs text-gray-500 font-normal"> /bulan</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;