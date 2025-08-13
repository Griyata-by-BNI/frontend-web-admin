"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Create a custom icon using the images from your `public` folder ---
// This is the most reliable way to ensure icons appear correctly.
const customIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],   // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41]  // size of the shadow
});

interface MapProps {
  center: [number, number];
  popupText: string;
}

const Map: React.FC<MapProps> = ({ center, popupText }) => {
  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Apply the custom icon to the Marker */}
      <Marker position={center} icon={customIcon}>
        <Popup>{popupText}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
