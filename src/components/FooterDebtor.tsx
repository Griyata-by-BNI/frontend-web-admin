// app/_components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { navItems, kprItems } from "./navbar/constants";

export default function FooterDebtor() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-gray-200">
      {/* Dekorasi */}
      {/* <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(48,165,162,0.22),rgba(15,23,42,0))]"
      /> */}

      {/* CTA Card (dark) */}
      <div className="custom-container px-6 md:px-0">
        <div className="relative -mt-10 rounded-2xl bg-slate-800/80 backdrop-blur ring-1 ring-white/10 shadow-xl shadow-black/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              Siap temukan rumah impian?
            </h3>
            <p className="mt-1 text-gray-300">
              Bandingkan cluster & simulasi KPR—semua di satu tempat.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/developers"
              className="rounded-full !bg-primary-tosca !text-slate-900 px-5 py-2.5 font-semibold hover:!brightness-95 transition"
            >
              Jelajahi Developer
            </Link>
            <Link
              href="/kpr-simulator"
              className="rounded-full border border-white/20 px-5 py-2.5 font-semibold !text-gray-200 hover:!border-primary-tosca hover:!text-primary-tosca transition"
            >
              Hitung KPR
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="custom-container px-6 md:px-0 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/logo-griyata.png"
                alt="Griyata Logo"
                width={140}
                height={56}
                priority
              />
            </Link>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed max-w-xs">
              Bantu kamu mencari properti terbaik dan menghitung KPR secara
              cepat, jelas, dan transparan.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {[
                {
                  href: "https://facebook.com",
                  label: "Facebook",
                  Icon: Facebook,
                },
                {
                  href: "https://instagram.com",
                  label: "Instagram",
                  Icon: Instagram,
                },
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  Icon: Linkedin,
                },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 hover:!border-primary-tosca hover:bg-primary-tosca/10 transition"
                >
                  <Icon className="w-4 h-4 text-gray-200 group-hover:text-primary-tosca" />
                  <span className="text-xs font-medium text-gray-200 group-hover:text-primary-tosca">
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[11px] rounded-full bg-slate-800 border border-white/10 text-gray-200 px-2 py-1">
                Mitra Developer Terpercaya
              </span>
              <span className="text-[11px] rounded-full bg-slate-800 border border-white/10 text-gray-200 px-2 py-1">
                Simulasi KPR Akurat
              </span>
              <span className="text-[11px] rounded-full bg-slate-800 border border-white/10 text-gray-200 px-2 py-1">
                Tanpa Biaya Tambahan
              </span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <p className="text-white font-semibold mb-3">Navigasi</p>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm !text-gray-300 hover:!text-primary-tosca transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Simulasi KPR */}
          <div>
            <p className="text-white font-semibold mb-3">Simulasi KPR</p>
            <ul className="space-y-2">
              {kprItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm !text-gray-300 hover:!text-primary-tosca transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="col-span-2 lg:col-span-2">
            <p className="text-white font-semibold mb-3">Kontak</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-tosca" />
                <span>Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary-tosca" />
                <a
                  href="tel:1500046"
                  className="!text-gray-300 hover:!text-primary-tosca transition-colors"
                >
                  +62 000 0000 000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary-tosca" />
                <a
                  href="mailto:hello@griyata.com"
                  className="!text-gray-300 hover:!text-primary-tosca transition-colors"
                >
                  hello@griyata.com
                </a>
              </li>
            </ul>

            {/* Quick CTA chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/kpr-affordability"
                className="text-xs rounded-full border border-white/15 px-3 py-1.5 !text-gray-200 hover:border-primary-tosca hover:!text-primary-tosca transition"
              >
                Cek Kemampuan KPR
              </Link>
              <Link
                href="/kpr-information"
                className="text-xs rounded-full border border-white/15 px-3 py-1.5 !text-gray-200 hover:border-primary-tosca hover:!text-primary-tosca transition"
              >
                Info KPR Lengkap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-slate-900/60">
        <div className="custom-container px-6 md:px-0 py-4 flex flex-col md:flex-row items-center gap-3">
          <p className="text-xs text-gray-400 md:mr-auto">
            © {year}{" "}
            <span className="font-semibold text-gray-200">Griyata</span>. All
            rights reserved.
          </p>

          {/* <div className="flex items-center gap-4 text-xs">
            <Link
              href="/privacy-policy"
              className="text-gray-300 hover:text-primary-tosca transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <span className="hidden md:inline text-gray-600">•</span>
            <Link
              href="/terms"
              className="text-gray-300 hover:text-primary-tosca transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div> */}

          {/* <Link
            href="#top"
            aria-label="Kembali ke atas"
            className="ml-auto md:ml-0 inline-flex items-center gap-1 text-xs text-gray-300 hover:text-primary-tosca transition"
          >
            <ArrowUp className="w-4 h-4" />
            Ke atas
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
