"use client";

import Link from "next/link";
import Image from "next/image";

type ToolItem = {
  title: string;
  desc: string;
  cta: string;
  href: string;
  imgSrc: string; // path di /public
};

const items: ToolItem[] = [
  {
    title: "Simulasi Angsuran KPR",
    desc: "Hitung estimasi cicilan per bulan berdasarkan harga, DP, tenor, dan bunga.",
    cta: "Cek Sekarang",
    href: "/kpr-simulator",
    imgSrc: "/images/angsuran.png",
  },
  {
    title: "Cek Kemampuan KPR",
    desc: "Estimasi plafon pinjaman sesuai penghasilan dan komitmen finansialmu.",
    cta: "Mulai Hitung",
    href: "/kpr-affordability",
    imgSrc: "/images/loan-home.png",
  },
  {
    title: "Info KPR",
    desc: "Pelajari persyaratan, biaya, dan tips mengajukan KPR dengan benar.",
    cta: "Pelajari",
    href: "/kpr-information",
    imgSrc: "/images/info.png",
  },
];

export default function KprToolsSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl rounded-3xl bg-light-tosca p-5 sm:p-6 md:p-8 lg:p-10">
        <div className="mb-4 sm:mb-6 md:mb-8 space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary-black">
            Griyata Tools
          </h2>

          <p className="text-sm md:text-base text-gray-600">
            Banyak fitur bantu kamu dapat properti impian
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((it) => (
            <Card key={it.title} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ title, desc, cta, href, imgSrc }: ToolItem) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-500/10 ring-1 ring-gray-700/5 p-5 sm:p-6 md:p-7 pb-12 sm:pb-14">
      {/* isi card: teks kiri, gambar kanan */}

      <h3 className="text-lg sm:text-xl font-semibold text-primary-black">
        {title}
      </h3>

      <div className="relative z-10 flex flex-row items-end justify-between gap-4 sm:gap-5 mb-4">
        <div className="flex-1">
          <p className="mt-1 text-xs md:text-sm text-gray-600 leading-relaxed">
            {desc}
          </p>

          <Link
            href={href}
            className="mt-4 inline-flex items-center justify-center rounded-md !bg-primary-tosca px-4 py-2 text-sm font-semibold !text-white transition hover:!bg-dark-tosca md:mb-4"
          >
            {cta}
          </Link>
        </div>

        {/* gambar selalu di kanan */}
        <div className="shrink-0">
          <Image
            src={imgSrc}
            alt={title}
            width={40}
            height={40}
            className="h-24 w-24 md:h-28 md:w-28 object-contain"
            priority={false}
          />
        </div>
      </div>

      {/* ornamen SVG full width */}
      <svg
        aria-hidden
        viewBox="0 0 600 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 w-full h-10 sm:h-12 md:h-14 block text-gray-200/75 z-0"
      >
        <path
          d="M0,50 C120,100 240,0 360,50 C440,85 520,85 600,50 L600,100 L0,100 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
