// app/need-login/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function NeedLoginPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const startedAtRef = useRef<number | null>(null);

  // Total waktu redirect (ms) → 5 detik
  const TOTAL = 5000;

  useEffect(() => {
    const timeout = setTimeout(() => router.push("/login"), TOTAL);

    startedAtRef.current = performance.now();
    const tick = () => {
      const now = performance.now();
      const elapsed = Math.min(TOTAL, now - (startedAtRef.current ?? now));
      const left = Math.ceil((TOTAL - elapsed) / 1000);
      setSecondsLeft(left);
      if (elapsed < TOTAL) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return () => clearTimeout(timeout);
  }, [router]);

  const progress = useMemo(() => {
    return ((5 - secondsLeft) / 5) * 100;
  }, [secondsLeft]);

  const goNow = () => router.push("/login");

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <main className="relative z-10 flex min-h-dvh items-center justify-center p-6">
        <section className="w-full max-w-lg rounded-2xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 border-b border-black/5 p-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck className="h-8 w-8 text-primary-tosca" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Aksi membutuhkan Login
            </h1>
            <p className="text-sm text-gray-600 text-center">
              Demi keamanan, Anda perlu masuk terlebih dahulu.
            </p>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            <div
              className="rounded-xl border border-gray-200 bg-white p-4 text-center"
              aria-live="polite"
            >
              <p className="text-gray-700">
                Anda akan diarahkan ke halaman{" "}
                <span className="font-medium">login</span> dalam{" "}
                <span className="font-semibold text-emerald-700">
                  {secondsLeft}s
                </span>
                .
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary-tosca transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label="Mengalihkan ke halaman login"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={goNow}
                className="inline-flex items-center justify-center rounded-xl bg-primary-tosca px-5 py-2.5 text-white shadow-sm transition hover:bg-dark-tosca active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                Masuk sekarang
              </button>
              <button
                onClick={() => history.back()}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Jika tidak dialihkan otomatis, klik “Masuk sekarang”.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
