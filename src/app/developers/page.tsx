import { Developer } from '@/types/developer';
import DeveloperSection from '@/components/DeveloperSection';
import Pagination from '@/components/Pagination';

// --- DATA DUMMY ---
// Nantinya, data ini akan Anda fetch dari API
const MOCK_DEVELOPERS: Developer[] = [
  {
    id: 'summarecon',
    name: 'Summarecon',
    logoUrl: '/file.svg', // Ganti dengan path logo yang sesuai di folder public
    description: 'Sejak 2024, salah satu unit bisnis pengembang properti terkemuka di Indonesia, Summarecon, sukses mengembangkan kawasan hunian bersama Summarecon Serpong yang hingga kini telah berhasil mengembangkan perumahan maupun komersial di area seluas kurang lebih 320 hektar.',
    properties: [
      { id: 'p1', name: 'Suvarna Sutera', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', price: '2.1 M', installment: '8.1 jt' },
      { id: 'p2', name: 'Suvarna Sutera', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', price: '2.1 M', installment: '8.1 jt' },
      { id: 'p3', name: 'Suvarna Sutera', location: 'Tangerang, Banten', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', price: '2.1 M', installment: '8.1 jt' },
    ]
  },
  // Anda bisa menambahkan developer lain di sini
  {
    id: 'sinarmas',
    name: 'Sinarmas Land',
    logoUrl: '/globe.svg', // Ganti dengan path logo yang sesuai di folder public
    description: 'Sinarmas Land adalah pengembang properti terkemuka dengan portofolio yang terdiversifikasi di berbagai kota besar di Indonesia.',
    properties: [
      { id: 'p4', name: 'BSD City', location: 'Tangerang Selatan, Banten', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', price: '3.5 M', installment: '15 jt' },
      { id: 'p5', name: 'Grand Wisata', location: 'Bekasi, Jawa Barat', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', price: '1.8 M', installment: '7.5 jt' },
      { id: 'p6', name: 'Kota Deltamas', location: 'Cikarang, Jawa Barat', imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0e2723225?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', price: '1.2 M', installment: '5 jt' },
    ]
  }
];

// Helper Icon
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

const PartnerDeveloperPage = () => {
  return (
    <div className="bg-teal-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        
        {/* Header dan Search Bar */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Partner Developer</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <HomeIcon />
                    <span className="mx-2">/</span>
                    <span>Beranda</span>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-700">Partner Developer</span>
                </div>
            </div>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Cari Developer"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                </div>
            </div>
        </div>

        {/* Daftar Developer */}
        {MOCK_DEVELOPERS.map(dev => (
          <DeveloperSection key={dev.id} developer={dev} />
        ))}
        
        {/* Pagination */}
        <Pagination />

      </main>
    </div>
  );
};

export default PartnerDeveloperPage;