import { Skeleton } from "antd";
import LatestClusterCardSkeleton from "../../_components/latestCluster/LatestClusterCardSkeleton";

export default function DeveloperSectionSkeleton() {
  return (
    <section>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <Skeleton.Image active style={{ width: 100, height: 100 }} />
          <div className="min-w-[240px]">
            <Skeleton.Input active style={{ width: 240, height: 28 }} />
            <div className="mt-2">
              <Skeleton
                active
                paragraph={{ rows: 2, width: ["90%", "70%"] }}
                title={false}
              />
            </div>
          </div>
        </div>
        <Skeleton.Button active style={{ width: 160, height: 36 }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((item, index) => (
          <LatestClusterCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
