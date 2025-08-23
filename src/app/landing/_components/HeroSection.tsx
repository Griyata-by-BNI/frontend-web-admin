import { Search, SlidersHorizontal } from "lucide-react";
import { FilterModal } from "./filter";

export default function HeroSection() {
  return (
    <>
      <section
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-[45vh] flex items-center justify-center overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-cyan-900/80 rounded-b-3xl"></div>
        <div className="relative z-10 w-full px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Jelajahi Properti dengan Griyata
            </h1>
            <p className="text-lg lg:text-xl text-teal-100 font">
              Pilihan Properti Terbaik dengan Kemudahan KPR BNI
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl max-w-5xl mx-auto border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search input */}
              <div
                className="flex-grow w-full flex items-center bg-gray-50 border-2 border-gray-200
                    rounded-xl focus-within:border-2  focus-within:border-primary-tosca
                    transition-all duration-300 h-[52px]"
              >
                <div className="pl-4 text-gray-400 pointer-events-none">
                  <Search className="w-6 h-6" />
                </div>

                <input
                  type="text"
                  placeholder="Cari nama properti, developer, atau lokasi..."
                  className="w-full pr-4 pl-3 border-none focus:outline-none bg-transparent text-gray-700
                    placeholder-gray-400 text-base h-full"
                />
              </div>

              {/* Sort & Filter */}
              <div className="w-full lg:w-auto flex-shrink-0 flex gap-3">
                <FilterModal />

                <button
                  className="w-full lg:w-auto px-6 flex items-center justify-center rounded-xl
                  bg-primary-tosca gap-2 font-semibold text-white cursor-pointer
                    transition-all duration-300 shadow-lg hover:bg-dark-tosca h-[52px] text-lg"
                >
                  <span>Cari Properti</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
