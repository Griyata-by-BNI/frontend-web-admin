import { useState } from 'react';
import { message } from 'antd';

interface NearbyPlace {
  name: string;
  distance: number;
}

interface NearbyPlaces {
  hospitals: NearbyPlace[];
  schools: NearbyPlace[];
  colleges: NearbyPlace[];
  supermarkets: NearbyPlace[];
  publicPlaces: NearbyPlace[];
  trainStations: NearbyPlace[];
  busStops: NearbyPlace[];
}

export const useNearbyPlaces = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaces>({
    hospitals: [],
    schools: [],
    colleges: [],
    supermarkets: [],
    publicPlaces: [],
    trainStations: [],
    busStops: []
  });
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
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'text/plain' }
      });
      
      const data = await response.json();
      
      const hospitals: NearbyPlace[] = [];
      const schools: NearbyPlace[] = [];
      const colleges: NearbyPlace[] = [];
      const supermarkets: NearbyPlace[] = [];
      const publicPlaces: NearbyPlace[] = [];
      const trainStations: NearbyPlace[] = [];
      const busStops: NearbyPlace[] = [];
      
      data.elements.forEach((element: any) => {
        const elementLat = element.lat || element.center?.lat;
        const elementLng = element.lon || element.center?.lon;
        
        if (elementLat && elementLng) {
          const distance = Math.round(
            Math.sqrt(
              Math.pow((elementLat - lat) * 111000, 2) +
              Math.pow((elementLng - lng) * 111000 * Math.cos(lat * Math.PI / 180), 2)
            )
          );
          
          if (element.tags?.amenity === 'hospital') {
            const name = element.tags?.name || 'Rumah Sakit';
            hospitals.push({ name, distance });
          } else if (element.tags?.amenity === 'school') {
            const name = element.tags?.name || 'Sekolah';
            schools.push({ name, distance });
          } else if (element.tags?.amenity === 'college' || element.tags?.amenity === 'university') {
            const name = element.tags?.name || 'Perguruan Tinggi';
            colleges.push({ name, distance });
          } else if (element.tags?.shop === 'supermarket' || element.tags?.amenity === 'marketplace') {
            const name = element.tags?.name || (element.tags?.shop === 'supermarket' ? 'Supermarket' : 'Pasar');
            supermarkets.push({ name, distance });
          } else if (element.tags?.leisure === 'park' || element.tags?.amenity === 'library') {
            const name = element.tags?.name || (element.tags?.leisure === 'park' ? 'Taman' : 'Perpustakaan');
            publicPlaces.push({ name, distance });
          } else if (element.tags?.public_transport === 'station' || element.tags?.railway === 'station' || element.tags?.aeroway === 'aerodrome') {
            const name = element.tags?.name || (element.tags?.aeroway === 'aerodrome' ? 'Bandara' : 'Stasiun');
            trainStations.push({ name, distance });
          } else if (element.tags?.highway === 'bus_stop') {
            const name = element.tags?.name || 'Halte Bus';
            busStops.push({ name, distance });
          }
        }
      });
      
      setNearbyPlaces({
        hospitals: hospitals.sort((a, b) => a.distance - b.distance).slice(0, 5),
        schools: schools.sort((a, b) => a.distance - b.distance).slice(0, 5),
        colleges: colleges.sort((a, b) => a.distance - b.distance).slice(0, 5),
        supermarkets: supermarkets.sort((a, b) => a.distance - b.distance).slice(0, 5),
        publicPlaces: publicPlaces.sort((a, b) => a.distance - b.distance).slice(0, 5),
        trainStations: trainStations.sort((a, b) => a.distance - b.distance).slice(0, 5),
        busStops: busStops.sort((a, b) => a.distance - b.distance).slice(0, 5)
      });
    } catch (error) {
      message.error('Gagal mengambil data tempat terdekat');
    } finally {
      setLoading(false);
    }
  };

  const resetPlaces = () => {
    setNearbyPlaces({ hospitals: [], schools: [], colleges: [], supermarkets: [], publicPlaces: [], trainStations: [], busStops: [] });
  };

  return {
    nearbyPlaces,
    loading,
    fetchNearbyPlaces,
    resetPlaces
  };
};