import type { Cluster, Developer } from "../types";

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
    id: "1",
    name: "Cluster Emerald",
    description: "Premium residential cluster with modern facilities",
    phone_number: "081234567892",
    images: ["https://images.unsplash.com/photo-1516156008625-3a9d6067fab5"],
    latitude: -6.2088,
    longitude: 106.8456,
    facilities: FacitiliesData,
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
  {
    id: "2",
    name: "Cluster Diamond",
    description: "Luxury cluster with exclusive amenities",
    phone_number: "081234567893",
    images: ["https://images.unsplash.com/photo-1516156008625-3a9d6067fab5"],
    latitude: -6.2089,
    longitude: 106.8457,
    facilities: FacitiliesData,
    created_at: "2025-08-13T04:42:53.000Z",
    updated_at: "2025-08-13T04:42:53.000Z",
  },
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
