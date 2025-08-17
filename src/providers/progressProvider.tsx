"use client";

import { ProgressProvider as BProgressProvider } from "@bprogress/next/app";

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BProgressProvider height="4px" color="#30a5a2">
        {children}
      </BProgressProvider>
    </>
  );
}
