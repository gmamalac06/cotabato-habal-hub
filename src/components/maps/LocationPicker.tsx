
import { useState, useEffect } from "react";
import GoogleMap from "./GoogleMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Search } from "lucide-react";
import { useGoogleMapApi } from "@/contexts/GoogleMapApiProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
  type: "pickup" | "dropoff";
}

export default function LocationPicker({ 
  initialLocation, 
  onSelectLocation,
  type
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [address, setAddress] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const { isLoaded } = useGoogleMapApi();
  const isMobile = useIsMobile();
  
  // Initialize geocoder
  const geocodeLocation = async (lat: number, lng: number) => {
    if (!window.google?.maps) {
      return "";
    }
    
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
        return response.results[0].formatted_address;
      }
      return "";
    } catch (error) {
      console.error("Geocoding error:", error);
      return "";
    }
  };

  // Handle map click
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      const formattedAddress = await geocodeLocation(lat, lng);
      setAddress(formattedAddress);
    }
  };

  // Handle search input
  const handleSearch = async () => {
    if (!searchInput.trim() || !window.google?.maps) return;
    
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address: searchInput });
      
      if (response.results[0] && response.results[0].geometry.location) {
        const lat = response.results[0].geometry.location.lat();
        const lng = response.results[0].geometry.location.lng();
        setSelectedLocation({ lat, lng });
        setAddress(response.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Search geocoding error:", error);
    }
  };

  // Handle confirm location
  const handleConfirm = () => {
    if (selectedLocation && address) {
      onSelectLocation({
        ...selectedLocation,
        address,
      });
    }
  };

  // Populate address when initialLocation changes
  useEffect(() => {
    if (initialLocation && isLoaded) {
      setSelectedLocation(initialLocation);
      geocodeLocation(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation, isLoaded]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          placeholder="Search for a location"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="pr-10"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full" 
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="rounded-md overflow-hidden border">
        <GoogleMap
          height={isMobile ? "200px" : "300px"}
          onClick={handleMapClick}
          markers={selectedLocation ? [
            {
              id: "selected",
              position: selectedLocation,
              icon: type === "pickup" 
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
          ] : []}
          center={selectedLocation || undefined}
          zoom={isMobile ? 15 : 14}
        />
      </div>
      
      <div className="flex items-start space-x-3">
        {type === "pickup" ? (
          <MapPin className="mt-1 h-4 w-4 text-green-500 flex-shrink-0" />
        ) : (
          <Navigation className="mt-1 h-4 w-4 text-red-500 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">{type === "pickup" ? "Pickup Location" : "Dropoff Location"}</p>
          <p className="text-xs text-muted-foreground break-words">
            {address || "Select a location on the map"}
          </p>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleConfirm}
        disabled={!selectedLocation}
        size={isMobile ? "sm" : "default"}
      >
        Confirm {type === "pickup" ? "Pickup" : "Dropoff"}
      </Button>
    </div>
  );
}
