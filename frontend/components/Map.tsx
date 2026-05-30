"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  lat?: number;
  lon?: number;
  city?: string;
}

export default function Map({ lat, lon, city }: MapProps) {
  if (lat == null || lon == null) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">Location Map</h3>
      <div style={{ height: 320 }}>
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[lat, lon]} icon={icon}>
            <Popup>{city || "Selected location"}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}