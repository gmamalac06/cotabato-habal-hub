
import { useCallback, useRef, useState } from "react";
import { GoogleMap as GoogleMapComponent, Marker } from "@react-google-maps/api";
import { useGoogleMapApi } from "@/contexts/GoogleMapApiProvider";
import { useIsMobile } from "@/hooks/use-mobile";

// Default map center (Cotabato City)
const defaultCenter = {
  lat: 7.2170,
  lng: 124.2482
};

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  height?: string;
  width?: string;
  className?: string;
}

export default function GoogleMap({
  center = defaultCenter,
  zoom = 14,
  onClick,
  markers = [],
  height = "400px",
  width = "100%",
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { isLoaded, loadError } = useGoogleMapApi();
  const isMobile = useIsMobile();
  
  // Store the map instance reference when the map is loaded
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  // If there's an error loading the map, display an error message
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md text-red-500 h-full">
        <p className="mb-2">Error loading Google Maps</p>
      </div>
    );
  }

  // While the map is loading, display a loading indicator
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full">Loading map...</div>;
  }

  return (
    <div style={{ height, width }} className={className}>
      <GoogleMapComponent
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={center}
        zoom={zoom}
        onClick={onClick}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: !isMobile,
          scrollwheel: true,
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            icon={marker.icon}
          />
        ))}
      </GoogleMapComponent>
    </div>
  );
}
