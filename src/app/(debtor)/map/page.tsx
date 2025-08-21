"use client";

import dynamic from "next/dynamic";

const ClustersMap = dynamic(() => import("./_components/ClustersMap"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="p-4">
      <h1 className="text-lg font-semibold mb-3">Peta Cluster</h1>

      <ClustersMap />
    </main>
  );
}
