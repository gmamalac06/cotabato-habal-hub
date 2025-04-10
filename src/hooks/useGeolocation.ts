
import { useState, useEffect } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: {
    lat: number;
    lng: number;
  } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "Geolocation is not supported by your browser",
        position: null,
      });
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    // Success handler
    const geoSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    };

    // Error handler
    const geoError = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        error: error.message,
        position: null,
      });
    };

    // First get a single position
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

    // Then watch for changes
    const watchId = navigator.geolocation.watchPosition(
      geoSuccess,
      geoError,
      geoOptions
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
