import { Search } from "lucide-react";
import { FilterModal } from "./filter";
import { Form } from "antd";
import { useFilterContext } from "@/contexts/filterContext";

export default function HeroSection() {
  const { form, handleSearch, initialValues } = useFilterContext();

  return (
    <Form form={form} onFinish={handleSearch} initialValues={initialValues}>
      <section
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-[48vh] sm:h-[52vh] md:h-[58vh] flex items-center justify-center overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-cyan-900/80 rounded-3xl" />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
              Jelajahi Properti dengan Griyata
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-teal-100">
              Pilihan Properti Terbaik dengan Kemudahan KPR BNI
            </p>
          </div>

          {/* Search panel */}
          <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-3xl shadow-xl max-w-5xl mx-auto border border-white/20">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-4 items-stretch md:items-center">
              <label className="sr-only" htmlFor="search">
                Cari properti
              </label>

              <div
                className="flex-grow w-full flex items-center bg-gray-50 border-3 border-gray-200 shadow-lg
              rounded-xl focus-within:border-primary-tosca transition-all duration-300 h-11 sm:h-12 md:h-[52px]"
              >
                <div className="pl-3 sm:pl-4 text-gray-400 pointer-events-none">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <Form.Item name="search" noStyle>
                  <input
                    id="search"
                    type="text"
                    placeholder="Cari nama properti, developer, atau lokasi..."
                    className="w-full pr-3 sm:pr-4 pl-2 sm:pl-3 border-none focus:outline-none bg-transparent text-gray-700
                    placeholder-gray-400 text-sm sm:text-base h-full"
                  />
                </Form.Item>
              </div>

              <div className="w-full md:w-auto flex-shrink-0 grid grid-cols-2 gap-3 md:flex md:grid-cols-none">
                <div className="w-full md:w-auto">
                  <FilterModal />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-4 sm:px-5 md:px-6 flex items-center justify-center rounded-xl
                    bg-primary-tosca gap-2 font-semibold text-white cursor-pointer
                transition-all duration-300 shadow-lg hover:bg-dark-tosca h-11 sm:h-12 md:h-[52px] text-sm sm:text-base"
                >
                  <span>Cari Properti</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Form>
  );
}
