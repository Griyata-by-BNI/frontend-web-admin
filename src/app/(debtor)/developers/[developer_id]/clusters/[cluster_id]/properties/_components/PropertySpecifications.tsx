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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Specification {
  text: string;
  icon: IconDefinition;
}

interface PropertySpecificationsProps {
  property: any;
}

const parseSpecifications = (property: any): Specification[] => {
  const specs: Specification[] = [];

  if (property.jumlahKamarTidur)
    specs.push({
      text: `${property.jumlahKamarTidur} Kamar Tidur`,
      icon: faBed,
    });
  if (property.jumlahKamarMandi)
    specs.push({
      text: `${property.jumlahKamarMandi} Kamar Mandi`,
      icon: faShower,
    });
  if (property.luasTanah)
    specs.push({
      text: `Luas Tanah ${property.luasTanah} m²`,
      icon: faChartArea,
    });
  if (property.luasBangunan)
    specs.push({
      text: `Luas Bangunan ${property.luasBangunan} m²`,
      icon: faHouse,
    });
  if (property.jumlahLantai)
    specs.push({ text: `${property.jumlahLantai} Lantai`, icon: faStairs });
  if (property.garasi) specs.push({ text: "Garasi", icon: faWarehouse });
  if (property.kolamRenang)
    specs.push({ text: "Kolam Renang", icon: faSwimmingPool });

  return specs;
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
        {specifications.map((spec: Specification, index: number) => (
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