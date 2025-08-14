export interface HomeType {
  idHomeType: string;
  name: string;
  type: string;
  location: string;
  imageUrl: string;
  specification: string;
  stock?: string;
  price: string; 
  installment: string; 
}

export interface Cluster {
  idCluster: string;
  name: string;
  dateUploaded: string;
  location: string;
  imageUrl: string;
  priceStart: string;
  priceEnd: string;
  installment: string;
  fasilities: string;
  description: string;
  homeType: HomeType[];
  coordinates: [number, number]; 
}

export interface Developer {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  clusters: Cluster[];
}

export const MOCK_DEVELOPERS: Developer[] = [
  {
    id: "alam-sutera",
    name: "Alam Sutera Group",
    logoUrl: "https://dummyimage.com/64x64/23b7ba/fff.png&text=LOGO+ALAM+SUTERA",
    description: "Alam Sutera mengusung konsep kota mandiri dengan fasilitas yang lengkap dan terintegrasi, mencakup hunian, area komersial, pusat perbelanjaan, perkantoran, dan fasilitas publik lainnya.",
    clusters: [
      {
        idCluster: "p1",
        name: "Suvarna Sutera",
        dateUploaded: "2025-07-01",
        location: "Tangerang, Banten",
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&q=85&fm=jpg&w=1200",
        priceStart: "2.1 M",
        priceEnd: "2.8 M",
        installment: "8.1 jt",
        fasilities: "Kolam renang, taman bermain, keamanan 24 jam",
        description: "Suvarna Sutera merupakan pengembangan kota mandiri...",
        coordinates: [-6.1783, 106.6319], // <-- Data koordinat ditambahkan
        homeType: [
          {
            idHomeType: "ht1",
            name: "Caksana",
            type: "A",
            location: "Tangerang, Banten",
            imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
            specification: "3 Kamar Tidur, 2 Kamar Mandi, 1 Garasi",
            stock: "5 Unit Tersedia",
            price: "2.1 M",
            installment: "8.1 jt"
          },
          {
            idHomeType: "ht2",
            name: "Caksana",
            type: "B",
            location: "Tangerang, Banten",
            imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
            specification: "2 Kamar Tidur, 1 Kamar Mandi, 1 Carport",
            stock: "8 Unit Tersedia",
            price: "1.8 M",
            installment: "7.5 jt"
          }
        ]
      },
      {
        idCluster: "p2",
        name: "Kota Sutera",
        dateUploaded: "2025-05-02",
        location: "Tangerang, Banten",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
        priceStart: "2.2 M",
        priceEnd: "3.0 M",
        installment: "8.5 jt",
        fasilities: "Taman, club house, jalur sepeda",
        description: "Suvarna Sutera 2 merupakan pengembangan kota mandiri...",
        coordinates: [-6.1750, 106.6550], 
        homeType: [
          {
            idHomeType: "ht3",
            name: "Ciksana",
            type: "B",
            location: "Tangerang, Banten",
            imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
            specification: "4 Kamar Tidur, 3 Kamar Mandi, 2 Garasi",
            stock: "3 Unit Tersedia",
            price: "2.5 M",
            installment: "9.0 jt"
          }
        ]
      }
    ]
  },
  {
    id: "sinarmas",
    name: "Sinarmas Land",
    logoUrl: "https://dummyimage.com/64x64/23b7ba/fff.png&text=LOGO+SINARMAS+LAND",
    description: "Sinarmas Land adalah pengembang properti terkemuka di Indonesia.",
    clusters: [
      {
        idCluster: "p4",
        name: "BSD City",
        dateUploaded: "2025-02-01",
        location: "Tangerang Selatan, Banten",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
        priceStart: "3.5 M",
        priceEnd: "4.8 M",
        installment: "15 jt",
        fasilities: "Pusat perbelanjaan, sekolah, rumah sakit",
        description: "Kota mandiri dengan fasilitas premium.",
        coordinates: [-6.2825, 106.7099], // <-- Data koordinat ditambahkan
        homeType: [
          {
            idHomeType: "ht4",
            name: "Tipe Sakura",
            type: "Rumah 2 Lantai",
            location: "Tangerang Selatan, Banten",
            imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
            specification: "4 Kamar Tidur, 3 Kamar Mandi, 2 Carport",
            stock: "10 Unit Tersedia",
            price: "3.5 M",
            installment: "15 jt"
          }
        ]
      },
      {
        idCluster: "p5",
        name: "Grand Wisata",
        dateUploaded: "2025-08-03",
        location: "Bekasi, Jawa Barat",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
        priceStart: "1.8 M",
        priceEnd: "2.5 M",
        installment: "7.5 jt",
        fasilities: "Area hijau, danau buatan, jogging track",
        description: "Perumahan hijau dan ramah lingkungan.",
        coordinates: [-6.2349, 106.9924], // <-- Data koordinat ditambahkan
        homeType: [
          {
            idHomeType: "ht5",
            name: "Anggrek",
            type: "A",
            location: "Bekasi, Jawa Barat",
            imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
            specification: "3 Kamar Tidur, 2 Kamar Mandi, 1 Garasi",
            stock: "6 Unit Tersedia",
            price: "1.8 M",
            installment: "7.5 jt"
          }
        ]
      }
    ]
  }
];
