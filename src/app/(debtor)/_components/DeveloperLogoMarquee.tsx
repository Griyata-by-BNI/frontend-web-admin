"use client";

import { useGetDevelopers } from "@/services/developerServices";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function DeveloperLogoMarquee({
  moreHref = "/developers",
  title = "Developer Terpercaya Pilihan Kami",
}: {
  moreHref?: string;
  title?: string;
}) {
  const { data, isLoading } = useGetDevelopers(9999, 1);

  const developers = useMemo(() => data?.data?.developers || [], [data]);

  const logos = useMemo(() => {
    return developers
      .map((d: any) => ({
        id: d.id,
        name: d.name ?? "Developer",
        url: d.developerPhotoUrl as string | null,
      }))
      .filter((x) => !!x.url) as {
      id: string | number;
      name: string;
      url: string;
    }[];
  }, [developers]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const [repeat, setRepeat] = useState(1);
  const [groupWidth, setGroupWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  const recalc = () => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const bw = measureRef.current?.scrollWidth ?? 0;
    if (cw > 0 && bw > 0) {
      const rep = Math.max(1, Math.ceil(cw / bw) + 1);
      setRepeat(rep);
      setGroupWidth(bw * rep);
    }
  };

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(() => recalc());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logos.length]);

  const SPEED = 120; // px/s
  const durationSec = Math.max(12, Math.round((groupWidth || 1) / SPEED));

  if (!isLoading && !logos.length) return null;

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="sm:px-0 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary-black">
            {title}
          </h2>
        </div>

        <Link
          href={moreHref}
          className="mt-1 sm:mt-0 self-start sm:self-auto inline-flex items-center gap-1 text-sm sm:text-base font-semibold !text-primary-tosca hover:!text-dark-tosca transition"
        >
          Lihat Selengkapnya
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div
        ref={containerRef}
        aria-label="Logo developer bergerak"
        className="relative w-full overflow-hidden rounded-2xl bg-white px-2 sm:px-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Hidden measurer */}
        <div
          className="absolute opacity-0 -z-10 pointer-events-none"
          ref={measureRef}
        >
          <div className="marquee-group">
            {logos.map((item) => (
              <LogoImg
                key={`measure-${item.id}`}
                src={item.url}
                alt={item.name}
                onLoad={recalc}
              />
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="w-full overflow-hidden">
            <div className="animate-pulse flex items-center gap-6 md:gap-8 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 md:h-40 w-24 sm:w-28 bg-gray-200 rounded"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center py-3 sm:py-4">
            <div className="flex items-center" style={{ width: "max-content" }}>
              <div
                className={`marquee-track ${paused ? "marquee-paused" : ""}`}
                style={
                  {
                    ["--marquee-duration" as any]: `${durationSec}s`,
                    ["--marquee-gap" as any]: "1.5rem",
                  } as React.CSSProperties
                }
              >
                {/* Group 1 */}
                <div className="marquee-group">
                  {Array.from({ length: repeat }).map((_, ri) =>
                    logos.map((item, idx) => (
                      <LogoImg
                        key={`g1-${ri}-${item.id}-${idx}`}
                        src={item.url}
                        alt={item.name}
                        onLoad={recalc}
                      />
                    ))
                  )}
                </div>

                {/* Group 2 */}
                <div className="marquee-group" aria-hidden>
                  {Array.from({ length: repeat }).map((_, ri) =>
                    logos.map((item, idx) => (
                      <LogoImg
                        key={`g2-${ri}-${item.id}-${idx}`}
                        src={item.url}
                        alt={item.name}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function LogoImg({
  src,
  alt,
  ariaHidden = false,
  onLoad,
}: {
  src: string;
  alt: string;
  ariaHidden?: boolean;
  onLoad?: () => void;
}) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={ariaHidden}
      className="h-20 md:h-40 w-auto object-contain select-none"
      loading="lazy"
      draggable={false}
      onLoad={onLoad}
    />
  );
}
