import Navbar from "@/components/navbar";

export default function DebtorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main className="flex-grow bg-gradient-to-t from-white to-light-tosca">
        <div className="flex flex-col max-w-6xl mx-8 lg:mx-auto py-4 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
