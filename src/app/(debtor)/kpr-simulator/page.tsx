import { KPRSimulator } from "./_components/KPRSimulator";
import {
  Calculator,
  ShieldCheck,
  Clock,
  Info,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function KprSimulatorPage() {
  return (
    <main className="custom-container py-6 md:py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-teal-50 via-white to-indigo-50 p-6 md:p-10 shadow-lg shadow-gray-500/10 mb-8">
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
        <div className="flex items-start gap-4">
          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 border border-teal-200">
            <Calculator className="h-6 w-6 text-teal-700" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Simulasi KPR
            </h1>
            <p className="mt-2 text-gray-600">
              Dapatkan estimasi angsuran KPR Anda secara cepat dan mudah!
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-3 py-1 text-sm font-semibold text-teal-800 border border-teal-200">
                <Clock className="h-4 w-4" /> Hitung instan
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-sm font-semibold text-indigo-800 border border-indigo-200">
                <TrendingUp className="h-4 w-4" /> Banyak skenario bunga
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3 py-1 text-sm font-semibold text-amber-800 border border-amber-200">
                <ShieldCheck className="h-4 w-4" /> Hasil transparan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left: Simulator */}
        <div className="lg:col-span-2">
          <KPRSimulator size="small" />
        </div>

        {/* Right: Tips & Info */}
        <aside className="mt-8 lg:mt-0 space-y-4">
          {/* Quick tips */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Tips Cepat
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>
                Sesuaikan DP agar cicilan bulanan tetap nyaman (&lt;35% gaji).
              </li>
              <li>Coba beberapa tenor untuk lihat perbedaan total bunga.</li>
              <li>Gunakan bunga tetap dulu untuk gambaran angsuran awal.</li>
            </ul>
          </div>

          {/* Catatan / disclaimer */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Catatan
              </h2>
            </div>
            <p className="text-sm text-gray-700">
              Hasil simulasi bersifat indikatif dan dapat berbeda dengan
              penawaran bank. Biaya lain seperti provisi, administrasi, notaris,
              dan asuransi belum diperhitungkan.
            </p>
            <Link
              href="/info/kpr"
              className="mt-3 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800 underline"
            >
              Pelajari detail biaya KPR →
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
