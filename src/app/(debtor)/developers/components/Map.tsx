"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital, faSchool, faUniversity, faStore, faMapMarkerAlt, faTrain, faBus } from "@fortawesome/free-solid-svg-icons";

const customIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface NearbyPlace {
  name: string;
  distance: number;
}

interface NearbyPlaceGroup {
  type: string;
  places: NearbyPlace[];
}

interface MapProps {
  center: [number, number];
  popupText: string;
}

interface MapWithNearbyPlacesProps {
  center: [number, number];
  popupText: string;
  nearbyPlaces: NearbyPlaceGroup[];
}

const getPlaceIcon = (type: string) => {
  switch (type) {
    case 'hospital': return faHospital;
    case 'school': return faSchool;
    case 'college': return faUniversity;
    case 'supermarket': return faStore;
    case 'publicPlace': return faMapMarkerAlt;
    case 'trainStation': return faTrain;
    case 'busStop': return faBus;
    default: return faMapMarkerAlt;
  }
};

const getPlaceLabel = (type: string) => {
  switch (type) {
    case 'hospital': return 'Rumah Sakit';
    case 'school': return 'Sekolah';
    case 'college': return 'Perguruan Tinggi';
    case 'supermarket': return 'Supermarket';
    case 'publicPlace': return 'Tempat Umum';
    case 'trainStation': return 'Stasiun Kereta';
    case 'busStop': return 'Halte Bus';
    default: return type;
  }
};

const Map: React.FC<MapProps> = ({ center, popupText }) => {
  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={customIcon}>
        <Popup>{popupText}</Popup>
      </Marker>
    </MapContainer>
  );
};

export const MapWithNearbyPlaces: React.FC<MapWithNearbyPlacesProps> = ({ 
  center, 
  popupText, 
  nearbyPlaces 
}) => {
  const availableTypes = nearbyPlaces.filter(group => group.places.length > 0);
  const [activeTab, setActiveTab] = useState(availableTypes[0]?.type || '');
  const activeGroup = nearbyPlaces.find(group => group.type === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative z-0">
      <div className="w-full h-96 relative z-0">
        <MapContainer center={center} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={customIcon}>
            <Popup>{popupText}</Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tempat Terdekat</h3>
        
        {availableTypes.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTypes.map((group) => (
                <button
                  key={group.type}
                  onClick={() => setActiveTab(group.type)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === group.type
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={getPlaceIcon(group.type)}
                    className="w-4 h-4 mr-2"
                  />
                  {getPlaceLabel(group.type)}
                </button>
              ))}
            </div>
            
            {activeGroup && (
              <div className="space-y-2">
                {activeGroup.places.slice(0, 5).map((place, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{place.name}</span>
                    <span className="text-teal-600 font-medium text-sm">
                      {place.distance >= 1000 
                        ? `${(place.distance / 1000).toFixed(1)} km`
                        : `${place.distance} m`
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Tidak ada tempat terdekat yang tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default Map;
