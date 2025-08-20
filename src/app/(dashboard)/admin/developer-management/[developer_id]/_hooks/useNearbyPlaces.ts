import { useState } from "react";
import { message } from "antd";
import { NearbyPlace, Place } from "@/types/cluster";

export const useNearbyPlaces = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const radius = 2000;
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="school"](around:${radius},${lat},${lng});
          way["amenity"="school"](around:${radius},${lat},${lng});
          node["amenity"="college"](around:${radius},${lat},${lng});
          way["amenity"="college"](around:${radius},${lat},${lng});
          node["amenity"="university"](around:${radius},${lat},${lng});
          way["amenity"="university"](around:${radius},${lat},${lng});
          node["shop"="supermarket"](around:${radius},${lat},${lng});
          way["shop"="supermarket"](around:${radius},${lat},${lng});
          node["amenity"="marketplace"](around:${radius},${lat},${lng});
          way["amenity"="marketplace"](around:${radius},${lat},${lng});
          node["leisure"="park"](around:${radius},${lat},${lng});
          way["leisure"="park"](around:${radius},${lat},${lng});
          node["amenity"="library"](around:${radius},${lat},${lng});
          way["amenity"="library"](around:${radius},${lat},${lng});
          node["public_transport"="station"](around:${radius},${lat},${lng});
          way["public_transport"="station"](around:${radius},${lat},${lng});
          node["railway"="station"](around:${radius},${lat},${lng});
          way["railway"="station"](around:${radius},${lat},${lng});
          node["highway"="bus_stop"](around:${radius},${lat},${lng});
          node["aeroway"="aerodrome"](around:${radius},${lat},${lng});
          way["aeroway"="aerodrome"](around:${radius},${lat},${lng});
        );
        out center meta;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/plain" },
      });

      const data = await response.json();

      const categorized: Record<string, Place[]> = {
        hospital: [],
        school: [],
        college: [],
        supermarket: [],
        publicPlace: [],
        trainStation: [],
        busStop: [],
      };

      data.elements.forEach((element: any) => {
        const elementLat = element.lat || element.center?.lat;
        const elementLng = element.lon || element.center?.lon;

        if (elementLat && elementLng) {
          const distance = Math.round(
            Math.sqrt(
              Math.pow((elementLat - lat) * 111000, 2) +
                Math.pow(
                  (elementLng - lng) * 111000 * Math.cos((lat * Math.PI) / 180),
                  2
                )
            )
          );

          if (element.tags?.amenity === "hospital") {
            const name = element.tags?.name || "Rumah Sakit";
            categorized.hospital.push({ name, distance });
          } else if (element.tags?.amenity === "school") {
            const name = element.tags?.name || "Sekolah";
            categorized.school.push({ name, distance });
          } else if (
            element.tags?.amenity === "college" ||
            element.tags?.amenity === "university"
          ) {
            const name = element.tags?.name || "Perguruan Tinggi";
            categorized.college.push({ name, distance });
          } else if (
            element.tags?.shop === "supermarket" ||
            element.tags?.amenity === "marketplace"
          ) {
            const name =
              element.tags?.name ||
              (element.tags?.shop === "supermarket" ? "Supermarket" : "Pasar");
            categorized.supermarket.push({ name, distance });
          } else if (
            element.tags?.leisure === "park" ||
            element.tags?.amenity === "library"
          ) {
            const name =
              element.tags?.name ||
              (element.tags?.leisure === "park" ? "Taman" : "Perpustakaan");
            categorized.publicPlace.push({ name, distance });
          } else if (
            element.tags?.public_transport === "station" ||
            element.tags?.railway === "station" ||
            element.tags?.aeroway === "aerodrome"
          ) {
            const name =
              element.tags?.name ||
              (element.tags?.aeroway === "aerodrome" ? "Bandara" : "Stasiun");
            categorized.trainStation.push({ name, distance });
          } else if (element.tags?.highway === "bus_stop") {
            const name = element.tags?.name || "Halte Bus";
            categorized.busStop.push({ name, distance });
          }
        }
      });

      // Konversi ke format NearbyPlace[]
      const result: NearbyPlace[] = [
        {
          type: "hospital",
          places: categorized.hospital
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
        {
          type: "school",
          places: categorized.school
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
        {
          type: "college",
          places: categorized.college
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
        {
          type: "supermarket",
          places: categorized.supermarket
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
        {
          type: "publicPlace",
          places: categorized.publicPlace
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
        {
          type: "trainStation",
          places: categorized.trainStation
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
        {
          type: "busStop",
          places: categorized.busStop
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5),
        },
      ];

      setNearbyPlaces(result);
    } catch (error) {
      message.error("Gagal mengambil data tempat terdekat");
    } finally {
      setLoading(false);
    }
  };

  const resetPlaces = () => {
    setNearbyPlaces([]);
  };

  return {
    nearbyPlaces,
    loading,
    fetchNearbyPlaces,
    resetPlaces,
  };
};
