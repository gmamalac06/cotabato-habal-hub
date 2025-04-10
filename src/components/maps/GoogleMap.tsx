
import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useGoogleMapApi } from "@/contexts/GoogleMapApiProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

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
  const { apiKey, setApiKey, isKeyConfigured } = useGoogleMapApi();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(!isKeyConfigured);
  const [newApiKey, setNewApiKey] = useState("");
  
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Show API key dialog when not configured
  useEffect(() => {
    if (!isKeyConfigured) {
      setShowApiKeyDialog(true);
    }
  }, [isKeyConfigured]);

  // Handle API key submission
  const handleSaveApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey.trim());
      setShowApiKeyDialog(false);
    }
  };

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
        <Button 
          variant="outline" 
          onClick={() => setShowApiKeyDialog(true)}
        >
          Configure API Key
        </Button>
      </div>
    );
  }

  // If the API key is not configured, show a message
  if (!isKeyConfigured) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-secondary border border-border rounded-md h-full">
        <p className="mb-2 text-center">Please configure your Google Maps API key</p>
        <Button onClick={() => setShowApiKeyDialog(true)}>
          Set API Key
        </Button>
        
        <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Google Maps API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                To use the map features, please enter your Google Maps API key. 
                You can get one from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a>.
              </p>
              <Input 
                placeholder="Enter your Google Maps API key" 
                value={newApiKey} 
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
      
      {/* API Key configuration button */}
      <div className="absolute top-2 right-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowApiKeyDialog(true)}
          className="bg-white shadow-sm hover:bg-gray-100 text-gray-600 text-xs"
        >
          Configure API Key
        </Button>
      </div>
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Google Maps API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              To use the map features, please enter your Google Maps API key. 
              You can get one from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a>.
            </p>
            <Input 
              placeholder="Enter your Google Maps API key" 
              value={newApiKey} 
              onChange={(e) => setNewApiKey(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveApiKey}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
