import Navbar from "@/components/navbar";

export default function DebtorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main className="flex-grow bg-light-tosca">
        <div className="flex flex-col max-w-[1200px] mx-8 lg:mx-auto py-4 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
