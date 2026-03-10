import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapView({ pickupCoords, dropoffCoords }) {
  return (
    <MapContainer
      center={pickupCoords || [28.6139, 77.209]}
      zoom={5}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pickupCoords && (
        <Marker position={pickupCoords}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {dropoffCoords && (
        <Marker position={dropoffCoords}>
          <Popup>Dropoff Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapView;
