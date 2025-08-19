"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheckDollar,
  faBed,
  faShower,
  faStairs,
  faChartArea,
  faHome,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export interface FilterState {
  price: { min: number; max: number };
  bedrooms: number;
  bathrooms: number;
  floors: number;
  landArea: { min: number; max: number };
  buildingArea: { min: number; max: number };
}

const initialFilterState: FilterState = {
  price: { min: 0, max: 15500000 },
  bedrooms: 0,
  bathrooms: 0,
  floors: 0,
  landArea: { min: 0, max: 200 },
  buildingArea: { min: 0, max: 180 },
};

interface FilterPopupProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onApplyAction: (filters: FilterState) => void;
}

const formatRupiah = (value: number) => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}M`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export default function FilterPopup({
  isOpen,
  onCloseAction,
  onApplyAction,
}: FilterPopupProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  if (!isOpen) {
    return null;
  }

  const handleReset = () => {
    setFilters(initialFilterState);
  };

  const handleApply = () => {
    onApplyAction(filters);
    onCloseAction();
  };

  const createCounterHandler =
    (field: "bedrooms" | "bathrooms" | "floors") => (increment: number) => {
      setFilters((prev) => ({
        ...prev,
        [field]: Math.max(0, prev[field] + increment),
      }));
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 my-8 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Filter</h2>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          <FilterSection
            icon={
              <FontAwesomeIcon
                icon={faMoneyCheckDollar}
                className="text-teal-600 w-5"
              />
            }
            title="Kisaran Harga Properti"
          >
            <div className="flex justify-between items-center mb-2 text-gray-700">
              <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md">
                {formatRupiah(filters.price.min)}
              </span>
              <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md">
                {formatRupiah(filters.price.max)}
              </span>
            </div>
            <RangeSlider
              min={0}
              max={15500000}
              step={100000}
              value={[filters.price.min, filters.price.max]}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  price: { min: value[0], max: value[1] },
                }))
              }
            />
          </FilterSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CounterSection
              icon={
                <FontAwesomeIcon icon={faBed} className="text-teal-600 w-5" />
              }
              title="Kamar Tidur"
              value={filters.bedrooms}
              onUpdate={createCounterHandler("bedrooms")}
            />
            <CounterSection
              icon={
                <FontAwesomeIcon
                  icon={faShower}
                  className="text-teal-600 w-5"
                />
              }
              title="Kamar Mandi"
              value={filters.bathrooms}
              onUpdate={createCounterHandler("bathrooms")}
            />
            <CounterSection
              icon={
                <FontAwesomeIcon
                  icon={faStairs}
                  className="text-teal-600 w-5"
                />
              }
              title="Jumlah Lantai"
              value={filters.floors}
              onUpdate={createCounterHandler("floors")}
            />
          </div>

          <FilterSection
            icon={
              <FontAwesomeIcon
                icon={faChartArea}
                className="text-teal-600 w-5"
              />
            }
            title="Luas Tanah (m²)"
          >
            <div className="flex justify-between items-center mb-2 text-gray-700">
              <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md">
                {filters.landArea.min} m²
              </span>
              <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md">
                {filters.landArea.max} m²
              </span>
            </div>
            <RangeSlider
              min={0}
              max={200}
              step={5}
              value={[filters.landArea.min, filters.landArea.max]}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  landArea: { min: value[0], max: value[1] },
                }))
              }
            />
          </FilterSection>

          <FilterSection
            icon={
              <FontAwesomeIcon icon={faHome} className="text-teal-600 w-5" />
            }
            title="Luas Bangunan (m²)"
          >
            <div className="flex justify-between items-center mb-2 text-gray-700">
              <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md">
                {filters.buildingArea.min} m²
              </span>
              <span className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-md">
                {filters.buildingArea.max} m²
              </span>
            </div>
            <RangeSlider
              min={0}
              max={180}
              step={5}
              value={[filters.buildingArea.min, filters.buildingArea.max]}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  buildingArea: { min: value[0], max: value[1] },
                }))
              }
            />
          </FilterSection>
        </div>

        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleReset}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CounterSection({
  icon,
  title,
  value,
  onUpdate,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  onUpdate: (increment: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="flex items-center justify-center gap-4 p-2 border border-gray-200 rounded-lg">
        <button
          onClick={() => onUpdate(-1)}
          disabled={value === 0}
          className="w-8 h-8 flex items-center justify-center text-xl font-bold text-teal-600 bg-teal-50 rounded-md disabled:text-gray-300 disabled:bg-gray-100 transition-colors"
        >
          -
        </button>
        <span className="text-lg font-bold w-10 text-center text-gray-800">
          {value}
        </span>
        <button
          onClick={() => onUpdate(1)}
          className="w-8 h-8 flex items-center justify-center text-xl font-bold text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

function RangeSlider(props: Slider.SliderProps) {
  return (
    <Slider.Root
      {...props}
      className="relative flex items-center select-none touch-none w-full h-5"
    >
      <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
        <Slider.Range className="absolute bg-teal-600 rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb className="block w-5 h-5 bg-white active:bg-teal-600 shadow-md rounded-full border-2 border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-colors" />
      <Slider.Thumb className="block w-5 h-5 bg-white active:bg-teal-600 shadow-md rounded-full border-2 border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-colors" />
    </Slider.Root>
  );
}
