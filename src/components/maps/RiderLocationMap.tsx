
import { useState, useEffect } from "react";
import GoogleMap from "./GoogleMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ride } from "@/types";
import { useGoogleMapApi } from "@/contexts/GoogleMapApiProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Navigation, Map } from "lucide-react";

interface RiderLocationMapProps {
  ride: Ride;
  className?: string;
}

export default function RiderLocationMap({ ride, className = "" }: RiderLocationMapProps) {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { isLoaded } = useGoogleMapApi();
  const isMobile = useIsMobile();

  // Start tracking driver location
  const startTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);
      setIsTracking(true);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Stop tracking driver location
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Calculate map bounds to show both pickup and dropoff
  const getMapCenter = () => {
    if (!ride.pickupLocation || !ride.dropoffLocation) {
      return { lat: 7.2170, lng: 124.2482 }; // Default to Cotabato City
    }

    // Return the midpoint between pickup and dropoff
    return {
      lat: (ride.pickupLocation.latitude + ride.dropoffLocation.latitude) / 2,
      lng: (ride.pickupLocation.longitude + ride.dropoffLocation.longitude) / 2,
    };
  };

  // Prepare markers for the map
  const getMapMarkers = () => {
    const markers = [];

    // Add pickup location marker
    if (ride.pickupLocation) {
      markers.push({
        id: "pickup",
        position: {
          lat: ride.pickupLocation.latitude,
          lng: ride.pickupLocation.longitude,
        },
        title: "Pickup",
        icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      });
    }

    // Add dropoff location marker
    if (ride.dropoffLocation) {
      markers.push({
        id: "dropoff",
        position: {
          lat: ride.dropoffLocation.latitude,
          lng: ride.dropoffLocation.longitude,
        },
        title: "Dropoff",
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });
    }

    // Add driver location marker if available
    if (driverLocation) {
      markers.push({
        id: "driver",
        position: driverLocation,
        title: "Your Location",
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });
    }

    return markers;
  };

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Ride Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 h-[300px] bg-secondary/50">
            Loading map...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className={`pb-2 ${isMobile ? "px-3 pt-3" : ""}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={isMobile ? "text-base" : "text-lg"}>
            <Map className="h-4 w-4 inline mr-1" /> Ride Locations
          </CardTitle>
          <div>
            {isTracking ? (
              <Button variant="outline" size="sm" onClick={stopTracking} className="h-8">
                Stop
              </Button>
            ) : (
              <Button size="sm" onClick={startTracking} className="h-8">
                Share Location
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 pb-3" : ""}>
        <GoogleMap
          height={isMobile ? "200px" : "300px"}
          center={getMapCenter()}
          markers={getMapMarkers()}
          zoom={13}
        />
        
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-green-500" />
            <p className="text-xs overflow-hidden text-ellipsis">{ride.pickupLocation.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="h-3 w-3 text-red-500" />
            <p className="text-xs overflow-hidden text-ellipsis">{ride.dropoffLocation.address}</p>
          </div>
          {driverLocation && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <p className="text-xs">Your current location</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
