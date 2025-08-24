import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "antd";

// =================================================================
// INTERFACE & PROPS
// =================================================================
interface ApiCluster {
  id: number;
  developerId: number;
  name: string;
  address: string | null;
  minPrice: string | null;
  cluster_photo_urls: string[];
}

interface ClusterCardProps {
  cluster: ApiCluster;
  developerId: number;
}

// =================================================================
// FUNGSI HELPER (SUDAH DISESUAIKAN)
// =================================================================
const formatPrice = (priceString: string | null): string => {
  if (!priceString) return "N/A";
  const price = Number(priceString);
  if (isNaN(price)) return "0";
  // Menambahkan spasi sebelum "M" dan "JT" agar sesuai target
  if (price >= 1_000_000_000)
    return `${(price / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
  if (price >= 1_000_000)
    return `${(price / 1_000_000).toFixed(1).replace(".0", "")} JT`;
  return price.toLocaleString("id-ID");
};

const calculateInstallment = (
  price?: string | null,
  tenor: number = 180, //default
  dpPercent: number = 10, // default 10%
  annualInterest: number = 3.25 // default 3.25%
) => {
  if (!price) return "N/A";
  // Parses the price string to a number
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum === 0) return "-";

  const dp = priceNum * (dpPercent / 100);
  const loanPrincipal = priceNum - dp;
  const monthlyInterest = annualInterest / 100 / 12;

  const n = tenor; // number of payments
  const r = monthlyInterest; // monthly interest rate

  // Annuity formula to calculate the monthly installment
  const installment = (loanPrincipal * r) / (1 - Math.pow(1 + r, -n));

  // Formats the output string based on the installment amount
  if (installment >= 1_000_000) {
    const million = installment / 1_000_000;
    // Displays the amount in millions (Juta), e.g., "Rp 1.5 JT"
    return (
      "Rp " +
      (million % 1 === 0 ? `${million}` : `${million.toFixed(1)}`) +
      " JT"
    );
  } else if (installment >= 1_000) {
    const thousand = installment / 1_000;
    // Displays the amount in thousands (Ribu), e.g., "Rp 632 RB"
    return "Rp " + Math.round(thousand) + " RB";
  }
  // Displays the rounded amount for values less than 1000
  return "Rp " + Math.round(installment).toLocaleString("id-ID");
};

// =================================================================
// KOMPONEN UTAMA
// =================================================================
const ClusterCard: React.FC<ClusterCardProps> = ({ cluster, developerId }) => {
  const href = `/developers/${developerId}/clusters/${cluster.id}`;
  const imageUrl =
    cluster.cluster_photo_urls?.[0] ||
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
  const installment = calculateInstallment(cluster.minPrice);

  return (
    // ✨ Mengubah Link agar tidak memiliki h-full
    <Link href={href} className="flex">
      {/* ✨ Mengubah rounded-lg menjadi rounded-2xl */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-500/10 overflow-hidden hover:shadow-primary-tosca/30 flex flex-col w-full">
        {/* GAMBAR: Slightly reduced height */}
        <div className="relative w-full h-44 bg-gray-100">
          {cluster.cluster_photo_urls &&
          cluster.cluster_photo_urls.length > 0 ? (
            <div className="h-full relative z-10">
              <Carousel
                autoplay
                dots
                className="h-full [&_.slick-prev]:left-2 [&_.slick-next]:right-2
                [&_.slick-prev]:z-20 [&_.slick-next]:z-20 [&_.slick-prev]:bg-black/50
                [&_.slick-next]:bg-black/50 [&_.slick-prev]:rounded-full
                [&_.slick-next]:rounded-full [&_.slick-prev]:w-8 [&_.slick-next]:w-8
                [&_.slick-prev]:h-8 [&_.slick-next]:h-8 [&_.slick-dots]:z-20"
              >
                {cluster.cluster_photo_urls.map((src, idx) => (
                  <div key={idx} className="relative w-full h-44">
                    <Image
                      src={src}
                      alt={`cluster-photo-${idx + 1}`}
                      objectFit="cover"
                      width={100}
                      height={100}
                      className="w-full h-full"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={cluster.name}
              objectFit="cover"
              width={100}
              height={100}
              className="w-full h-full"
            />
          )}
        </div>

        {/* KONTEN: Slightly reduced padding */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Judul: Smaller font */}
          <h3 className="text-lg font-bold text-teal-700">{cluster.name}</h3>

          {/* Alamat: Increased font size and margin */}
          <p className="text-base text-teal-600/90 mt-2 mb-4">
            {cluster.address || "Lokasi tidak tersedia"}
          </p>

          {/* HARGA & ANGSURAN: Increased padding */}
          <div className="mt-auto flex items-center pt-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Harga mulai dari</p>
              {/* Smaller price font size */}
              <p className="text-base font-bold text-gray-800 mt-1">
                <span className="font-normal text-sm">Rp</span>{" "}
                {formatPrice(cluster.minPrice)}
              </p>
            </div>

            {/* Slightly smaller divider */}
            <div className="h-10 w-px bg-gray-200 mx-3"></div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">Angsuran mulai dari</p>
              {/* Smaller installment font size */}
              <p className="text-base font-bold text-gray-800 mt-1">
                {installment}
                <span className="text-sm text-gray-500 font-normal">
                  {" "}
                  /bulan
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClusterCard;
