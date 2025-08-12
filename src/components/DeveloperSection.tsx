import Image from 'next/image';
import Link from 'next/link';
import { Developer } from '@/types/developer';
import PropertyCard from './PropertyCard';

interface DeveloperSectionProps {
  developer: Developer;
}

const DeveloperSection: React.FC<DeveloperSectionProps> = ({ developer }) => {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Image src={developer.logoUrl} alt={`${developer.name} logo`} width={40} height={40} />
          <h2 className="text-2xl font-bold text-gray-800 ml-4">{developer.name}</h2>
        </div>
        <Link href={`/developers/${developer.id}`}>
            Lihat lebih lengkap &gt;
        </Link>
      </div>
      <p className="text-gray-600 mb-6">{developer.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developer.properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};

export default DeveloperSection;