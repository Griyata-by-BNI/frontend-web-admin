"use client";

import { Search } from "lucide-react";
import { Form } from "antd";
import { useFilterContext } from "@/contexts/filterContext";
import { FilterModal } from "../../_components/filter";
import { useEffect } from "react";

export default function SearchBar() {
  const { form, handleSearch, initialValues } = useFilterContext();

  return (
    <Form form={form} onFinish={handleSearch} initialValues={initialValues}>
      <div className="bg-primary-tosca/20 p-4 sm:p-5 md:p-6 rounded-2xl border border-white/20">
        <div className="flex flex-row items-stretch gap-2 sm:gap-3 md:gap-4">
          <label className="sr-only" htmlFor="search">
            Cari properti
          </label>
          <div
            className="flex-1 flex items-center bg-gray-50 border-3 border-gray-200 shadow-lg
              rounded-xl focus-within:border-primary-tosca transition-all duration-300
              h-11 sm:h-12 md:h-[52px]"
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

          {/* Actions: Filter + Submit */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="
                [&_button]:h-11 sm:[&_button]:h-12 md:[&_button]:h-[52px]
                [&_button]:w-11 sm:[&_button]:w-auto
                [&_button]:px-0 sm:[&_button]:px-5
                [&_span]:hidden sm:[&_span]:inline
              "
            >
              <FilterModal />
            </div>

            <button
              type="submit"
              className="w-11 sm:w-auto h-11 sm:h-12 md:h-[52px]
                px-0 sm:px-5 md:px-6 flex items-center justify-center rounded-xl
                bg-primary-tosca gap-2 font-semibold text-white cursor-pointer
                transition-all duration-300 shadow-lg hover:bg-dark-tosca text-sm sm:text-base"
            >
              <Search className="w-5 h-5 sm:hidden" />
              <span className="hidden sm:inline">Cari Properti</span>
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
}
