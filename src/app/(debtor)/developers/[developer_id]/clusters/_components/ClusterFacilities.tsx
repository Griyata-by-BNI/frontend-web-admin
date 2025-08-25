import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faBus,
  faChild,
  faChurch,
  faCoffee,
  faDumbbell,
  faHospital,
  faMosque,
  faPlane,
  faRunning,
  faSchool,
  faShieldAlt,
  faShoppingBag,
  faShoppingCart,
  faStore,
  faSwimmingPool,
  faTrain,
  faTree,
  faUsers,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

interface ClusterFacilitiesProps {
  facilities: string;
}

export default function ClusterFacilities({ facilities }: ClusterFacilitiesProps) {
  const facilityIcons: Record<string, any> = {
    masjid: faMosque,
    gereja: faChurch,
    cafe: faCoffee,
    "ruang komunitas": faUsers,
    school: faSchool,
    hospital: faHospital,
    "grocery store": faShoppingBag,
    minimarket: faStore,
    "halte bus": faBus,
    gym: faDumbbell,
    stasiun: faTrain,
    bandara: faPlane,
    security: faShieldAlt,
    "swimming pool": faSwimmingPool,
    "kolam renang": faSwimmingPool,
    "outdoor playground": faChild,
    "club house": faBuilding,
    "jogging track": faRunning,
    restoran: faUtensils,
    mall: faShoppingCart,
    taman: faTree,
  };

  const facilityList = (facilities || "")
    .split(",")
    .map((f: string) => f.trim().toLowerCase())
    .map((name: string) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      icon: facilityIcons[name],
    }))
    .filter((f) => f.icon && f.name);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 mb-6 shadow-lg shadow-gray-500/10">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Fasilitas Umum
      </h2>
      {facilityList.length ? (
        <div className="flex flex-wrap gap-3">
          {facilityList.map((f) => (
            <span
              key={f.name}
              className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-gray-200 px-3 py-1.5 text-sm text-gray-700 shadow-sm"
            >
              <FontAwesomeIcon
                icon={f.icon}
                className="w-4 h-4 text-teal-600"
              />
              {f.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Fasilitas tidak tersedia.</p>
      )}
    </div>
  );
}