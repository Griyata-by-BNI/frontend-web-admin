import type { Cluster, Developer, ClusterType, Property } from "../types";

export const FacitiliesData = [
  "Kolam Renang",
  "Gym",
  "Restoran",
  "Mall",
  "Taman",
  "Masjid",
  "Gereja",
  "Cafe",
  "Ruang Komunitas",
  "Minimarket",
];

export const mockClusterData: Cluster[] = [
  {
    id: 1,
    developerId: 1,
    developerName: "PT Ciputra Development",
    latitude: "-6.2088",
    longitude: "106.8456",
    facilities: "Kolam Renang, Gym, Taman, Masjid",
    phone_number: "081234567892",
    max_price: "1500000000",
    min_price: "1200000000",
    name: "Cluster Emerald",
    description:
      "Sebagai pengembang properti terdepan dan terpercaya di Indonesia, Agung Podomoro Land tidak hanya membangun rumah, tapi menciptakan sebuah mahakarya kehidupan. Setiap proyek kami dirancang sebagai kawasan terpadu (one-stop living) yang menyatukan kenyamanan hunian premium dengan fasilitas kelas dunia. Nikmati kemudahan hidup di mana pusat perbelanjaan, area bisnis, sekolah, dan ruang hijau yang asri berada hanya beberapa langkah dari pintu Anda.",
    createdBy: 1,
    updatedBy: 1,
    address: "Jl. Lada Dalam No 1",
    cluster_photo_urls: [
      "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1542687226-54a9a41eeafd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  {
    id: 2,
    developerId: 2,
    developerName: "PT Agung Podomoro Land",
    latitude: "-6.2089",
    longitude: "106.8457",
    facilities: "Kolam Renang, Gym, Restoran, Mall",
    phone_number: "081234567893",
    max_price: "1800000000",
    min_price: "1400000000",
    name: "Cluster Diamond",
    description:
      "Sebagai pengembang properti terdepan dan terpercaya di Indonesia, Agung Podomoro Land tidak hanya membangun rumah, tapi menciptakan sebuah mahakarya kehidupan. Setiap proyek kami dirancang sebagai kawasan terpadu (one-stop living) yang menyatukan kenyamanan hunian premium dengan fasilitas kelas dunia. Nikmati kemudahan hidup di mana pusat perbelanjaan, area bisnis, sekolah, dan ruang hijau yang asri berada hanya beberapa langkah dari pintu Anda.",
    createdBy: 1,
    address: "Jl. Lada Dalam No 1",
    updatedBy: 1,
    cluster_photo_urls: [
      "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1542687226-54a9a41eeafd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
];

export const mockClusterTypeData: ClusterType[] = [
  {
    id: 1,
    developerId: 1,
    developerName: "PT Ciputra Development",
    clusterId: 1,
    clusterName: "Cluster Emerald",
    name: "Tipe A",
    createdBy: 1,
    updatedBy: 1,
    propertyCount: 10,
  },
  {
    id: 2,
    developerId: 1,
    developerName: "PT Ciputra Development",
    clusterId: 1,
    clusterName: "Cluster Emerald",
    name: "Tipe B",
    propertyCount: 10,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 3,
    developerId: 2,
    developerName: "PT Agung Podomoro Land",
    clusterId: 2,
    clusterName: "Cluster Diamond",
    name: "Tipe A",
    propertyCount: 10,
    createdBy: 1,
    updatedBy: 1,
  },
];

export const mockPropertyData: Property[] = [
  {
    id: 1,
    developerId: 1,
    developerName: "PT Ciputra Development",
    clusterId: 1,
    clusterName: "Cluster Emerald",
    clusterTypeId: 1,
    clusterTypeName: "Tipe A",
    name: "Rumah Emerald A1",
    description: "Rumah minimalis modern",
    price: "1200000000.00",
    location: "Jakarta Selatan",
    latitude: "-6.2088",
    longitude: "106.8456",
    isDeleted: false,
    facilities: "Kolam Renang, Gym, Taman",
    spesifications: "2 lantai, 3 kamar tidur, 2 kamar mandi",
    sellingPrice: "1250000000.00",
    landArea: "120.00",
    stock: 5,
    buildingArea: "90.00",
    collateralAddress: "Jl. Emerald No. 1",
    createdAt: "2025-08-12T19:22:17.245Z",
    updatedAt: "2025-08-12T19:22:17.245Z",
    property_photo_urls: [
      "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1542687226-54a9a41eeafd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  },
  {
    id: 2,
    developerId: 1,
    developerName: "PT Ciputra Development",
    clusterId: 1,
    clusterName: "Cluster Emerald",
    clusterTypeId: 2,
    clusterTypeName: "Tipe B",
    name: "Rumah Emerald B1",
    description: "Rumah keluarga luas",
    price: "1400000000.00",
    location: "Jakarta Selatan",
    latitude: "-6.2089",
    longitude: "106.8457",
    isDeleted: false,
    facilities: "Kolam Renang, Gym, Taman",
    spesifications: "2 lantai, 4 kamar tidur, 3 kamar mandi",
    sellingPrice: "1450000000.00",
    landArea: "150.00",
    stock: 3,
    buildingArea: "120.00",
    collateralAddress: "Jl. Emerald No. 2",
    createdAt: "2025-08-12T19:22:17.245Z",
    updatedAt: "2025-08-12T19:22:17.245Z",
    property_photo_urls: [
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  },
  {
    id: 3,
    developerId: 2,
    developerName: "PT Agung Podomoro Land",
    clusterId: 2,
    clusterName: "Cluster Diamond",
    clusterTypeId: 3,
    clusterTypeName: "Tipe A",
    name: "Rumah Diamond A1",
    description: "Rumah mewah eksklusif",
    price: "1600000000.00",
    location: "Jakarta Pusat",
    latitude: "-6.2090",
    longitude: "106.8458",
    isDeleted: false,
    facilities: "Kolam Renang, Gym, Restoran, Mall",
    spesifications: "3 lantai, 5 kamar tidur, 4 kamar mandi",
    sellingPrice: "1650000000.00",
    landArea: "200.00",
    stock: 2,
    buildingArea: "180.00",
    collateralAddress: "Jl. Diamond No. 1",
    createdAt: "2025-08-12T19:22:17.245Z",
    updatedAt: "2025-08-12T19:22:17.245Z",
    property_photo_urls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  }
];

export const mockDeveloperData: Developer[] = [
  {
    id: "1",
    name: "PT Ciputra Development",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Agung_Podomoro_Land_-_Logo_2023.svg/2560px-Agung_Podomoro_Land_-_Logo_2023.svg.png",
    cluster_count: "15",
    phone_number: "081234567890",
    description:
      "Sebagai pengembang properti terdepan dan terpercaya di Indonesia, Agung Podomoro Land tidak hanya membangun rumah, tapi menciptakan sebuah mahakarya kehidupan. Setiap proyek kami dirancang sebagai kawasan terpadu (one-stop living) yang menyatukan kenyamanan hunian premium dengan fasilitas kelas dunia. Nikmati kemudahan hidup di mana pusat perbelanjaan, area bisnis, sekolah, dan ruang hijau yang asri berada hanya beberapa langkah dari pintu Anda.",
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
  {
    id: "2",
    name: "PT Agung Podomoro Land",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Agung_Podomoro_Land_-_Logo_2023.svg/2560px-Agung_Podomoro_Land_-_Logo_2023.svg.png",
    cluster_count: "8",
    phone_number: "081234567891",
    description:
      "Sebagai pengembang properti terdepan dan terpercaya di Indonesia, Agung Podomoro Land tidak hanya membangun rumah, tapi menciptakan sebuah mahakarya kehidupan. Setiap proyek kami dirancang sebagai kawasan terpadu (one-stop living) yang menyatukan kenyamanan hunian premium dengan fasilitas kelas dunia. Nikmati kemudahan hidup di mana pusat perbelanjaan, area bisnis, sekolah, dan ruang hijau yang asri berada hanya beberapa langkah dari pintu Anda.",
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
];
