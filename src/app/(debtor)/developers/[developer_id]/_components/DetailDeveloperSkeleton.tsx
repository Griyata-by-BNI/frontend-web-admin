import { Skeleton } from "antd";
import { Building2 } from "lucide-react";

export default function DeveloperDetailSkeleton() {
  return (
    <div className="custom-container min-h-screen py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Skeleton.Input active size="small" style={{ width: 200 }} />
      </div>

      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50 shadow-lg shadow-gray-500/10 border border-gray-200 p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <Skeleton.Image active style={{ width: 250, height: 125 }} />
          <div className="w-full md:max-w-2/3">
            <Skeleton
              active
              title={{ width: "60%" }}
              paragraph={{ rows: 3, width: ["95%", "85%", "70%"] }}
            />
          </div>
        </div>
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
      </div>

      {/* Projects Section */}
      <section id="proyek" className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-gray-400" />
          <Skeleton.Input active size="small" style={{ width: 180 }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-4"
            >
              <Skeleton.Image
                active
                style={{ width: "100%", height: 140, marginBottom: 12 }}
                className="!w-full"
              />
              <Skeleton
                active
                title={{ width: "70%" }}
                paragraph={{ rows: 2, width: ["95%", "60%"] }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
