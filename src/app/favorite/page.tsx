import Pagination from '@/components/Pagination';
import Image from 'next/image';


// --- Ikon SVG sebagai Komponen React ---
const StarIconLarge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#14b8a6" stroke="#fff"/>
    </svg>
);

const StarIconFilled = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#14b8a6" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

// Ikon baru untuk detail properti
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M2 4v16h20V4Z"/><path d="M2 10h20"/></svg>;
const BathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0L2 6"/><path d="m2 16 6 6"/><path d="M22 16 16 22"/><path d="M17 11h.01"/><path d="M15 13h.01"/><path d="M13 15h.01"/><path d="M22 8 12 18"/><path d="M15 3 5 13"/><path d="M22 8a6 6 0 0 0-8.49-8.49"/></svg>;
const BuildingAreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>;
const LandAreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M21.2,12.3H20V9.8c0-1.1-0.9-2-2-2h-2.5V5.8c0-1.1-0.9-2-2-2h-5c-1.1,0-2,0.9-2,2v2H3.8c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2v-2.5h1.2c0.7,0,1.2-0.5,1.2-1.2V13.5C22.5,12.8,21.9,12.3,21.2,12.3z M18.8,20H3.8c-0.6,0-1-0.4-1-1v-9.2c0-0.6,0.4-1,1-1h15c0.6,0,1,0.4,1,1V20z"/><path d="M11.5,15.3h-5c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5h5c0.3,0,0.5,0.2,0.5,0.5v5C12,15.1,11.8,15.3,11.5,15.3z"/></svg>;


// --- Definisi Tipe Data (TypeScript) ---
interface Property {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  installment: string;
  bedrooms: number;
  bathrooms: number;
  buildingArea: number;
  landArea: number;
}

// --- Data Dummy (Mock Data) ---
const MOCK_FAVORITES: Property[] = [
  { id: 'fav1', name: 'Suvarna Sutera - Tipe A', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', price: '819 JT', installment: '8.1jt', bedrooms: 3, bathrooms: 3, buildingArea: 117, landArea: 105 },
  { id: 'fav2', name: 'Suvarna Sutera - Tipe B', imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600', price: '819 JT', installment: '8.1jt', bedrooms: 3, bathrooms: 3, buildingArea: 117, landArea: 105 },
  { id: 'fav3', name: 'Suvarna Sutera - Tipe C', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600', price: '819 JT', installment: '8.1jt', bedrooms: 3, bathrooms: 3, buildingArea: 117, landArea: 105 },
  { id: 'fav4', name: 'Suvarna Sutera - Tipe D', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', price: '819 JT', installment: '8.1jt', bedrooms: 3, bathrooms: 3, buildingArea: 117, landArea: 105 },
  { id: 'fav5', name: 'Suvarna Sutera - Tipe E', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', price: '819 JT', installment: '8.1jt', bedrooms: 3, bathrooms: 3, buildingArea: 117, landArea: 105 }
];

// --- Komponen-komponen ---

// 1. Komponen Kartu Properti yang diperbarui
const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col relative">
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full z-10 cursor-pointer">
          <StarIconFilled />
      </div>
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
        
        {/* Price & Installment */}
        <div className="my-4 flex items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Harga</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              Rp {property.price}
            </p>
          </div>
          <div className="h-10 w-px bg-gray-200 mx-4"></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Angsuran mulai dari</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              Rp {property.installment}
              <span className="text-sm text-gray-500 font-normal"> /bulan</span>
            </p>
          </div>
        </div>

        {/* Details (Bed, Bath, Area) */}
        <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2"><BedIcon /><span >KT: {property.bedrooms}</span></div>
            <div className="flex items-center gap-2"><BuildingAreaIcon /><span>LB: {property.buildingArea} m²</span></div>
            <div className="flex items-center gap-2"><BathIcon /><span>KM: {property.bathrooms}</span></div>
            <div className="flex items-center gap-2"><LandAreaIcon /><span>LT: {property.landArea} m²</span></div>
        </div>
      </div>
    </div>
  );
};


// --- Komponen Utama Aplikasi ---
export default function App() {
  return (
    <div className="bg-[#e0f2f1] min-h-screen font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-10">
            <div className="flex justify-center items-center mb-4">
                <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <StarIconLarge />
                    </div>
                </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Rumah Favorite Anda!</h1>
            <p className="text-gray-600 mt-2">Pantau properti yang Anda sukai dan kunjungi kembali kapan saja</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_FAVORITES.map(property => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>

        <Pagination />

      </main>
    </div>
  );
}
