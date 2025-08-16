import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 px-8 py-6 min-h-screen bg-white overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
