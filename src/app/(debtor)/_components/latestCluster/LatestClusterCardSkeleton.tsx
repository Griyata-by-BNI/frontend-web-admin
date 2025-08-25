import { Skeleton } from "antd";
import React from "react";

interface LatestClusterCardSkeletonProps {
  className?: string;
}

const LatestClusterCardSkeleton: React.FC<LatestClusterCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex ${className}`} aria-hidden>
      <article
        className="bg-white rounded-2xl shadow-xl shadow-gray-500/10 border 
      border-gray-200 overflow-hidden flex flex-col w-full"
      >
        <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
          <Skeleton.Image
            active
            style={{ width: "100%", height: "100%" }}
            className="!w-full h-full"
          />
        </div>

        {/* CONTENT SKELETON */}
        <div className="p-5 flex-grow flex flex-col">
          <Skeleton
            active
            title={{ width: "75%" }}
            paragraph={{ rows: 2, width: ["95%", "70%"] }}
            className="!mb-4"
          />

          <div className="mt-auto flex items-center pt-4">
            <div className="flex-1 min-w-0">
              <Skeleton.Input
                active
                size="small"
                style={{ width: 120, height: 14 }}
                className="!rounded-md"
              />

              <div className="mt-2">
                <Skeleton.Input
                  active
                  size="default"
                  style={{ width: 160, height: 20 }}
                  className="!rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default LatestClusterCardSkeleton;
