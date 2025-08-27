"use client";

import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBed,
  faChartArea,
  faHouse,
  faShower,
  faStairs,
  faSwimmingPool,
  faWarehouse,
  faDumbbell,
  faSeedling,
  faParking,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Specification {
  text: string;
  icon: IconDefinition;
}

interface PropertySpecificationsProps {
  property: any;
}

const normalizeKey = (text: string) =>
  text.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");

const pushUnique = (
  map: Map<string, Specification>,
  text: string,
  icon: IconDefinition
) => {
  const key = normalizeKey(text);
  if (!map.has(key)) {
    map.set(key, { text, icon });
  }
};

const parseSpecifications = (property: any): Specification[] => {
  const map = new Map<string, Specification>();

  // --- dari properti numeric/boolean ---
  if (property.jumlahKamarTidur) {
    pushUnique(map, `${property.jumlahKamarTidur} Kamar Tidur`, faBed);
  }
  if (property.jumlahKamarMandi) {
    pushUnique(map, `${property.jumlahKamarMandi} Kamar Mandi`, faShower);
  }
  const luasTanah = property.luasTanah ?? property.landArea;
  if (luasTanah) {
    pushUnique(map, `Luas Tanah ${luasTanah} m²`, faChartArea);
  }
  const luasBangunan = property.luasBangunan ?? property.buildingArea;
  if (luasBangunan) {
    pushUnique(map, `Luas Bangunan ${luasBangunan} m²`, faHouse);
  }
  if (property.jumlahLantai) {
    pushUnique(map, `${property.jumlahLantai} Lantai`, faStairs);
  }
  if (property.garasi) {
    pushUnique(map, "Garasi", faWarehouse);
  }
  if (property.kolamRenang) {
    pushUnique(map, "Kolam Renang", faSwimmingPool);
  }

  // --- dari string `spesifications` (contoh: "Gym, Garasi") ---
  if (property.spesifications) {
    const extraSpecs = String(property.spesifications)
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    extraSpecs.forEach((spec: string) => {
      const lower = spec.toLowerCase();

      let icon: IconDefinition = faCheck; // default
      if (lower.includes("gym")) icon = faDumbbell;
      else if (lower.includes("garasi") || lower.includes("carport"))
        icon = faWarehouse;
      else if (lower.includes("kolam")) icon = faSwimmingPool;
      else if (lower.includes("taman")) icon = faSeedling;
      else if (lower.includes("park")) icon = faParking;

      pushUnique(map, spec, icon);
    });
  }

  return Array.from(map.values());
};

export default function PropertySpecifications({
  property,
}: PropertySpecificationsProps) {
  const specifications = parseSpecifications(property);

  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Spesifikasi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="flex items-center p-3 rounded-xl bg-teal-50 border border-teal-100"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={spec.icon}
                className="text-teal-600 w-5 h-5"
              />
            </div>
            <span className="ml-3 text-gray-800 font-medium">{spec.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
