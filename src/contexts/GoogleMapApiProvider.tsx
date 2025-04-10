
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface GoogleMapApiContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapApiContext = createContext<GoogleMapApiContextType | undefined>(undefined);

interface GoogleMapApiProviderProps {
  children: ReactNode;
}

// Fixed API key
const GOOGLE_MAPS_API_KEY = "AIzaSyDt1zdFIA-s113Rft92r0_zyvfvSI-JDeE";

export function GoogleMapApiProvider({ children }: GoogleMapApiProviderProps) {
  // Track loading status at the provider level
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);

  // Initialize loader globally with the fixed API key
  useEffect(() => {
    // Only load the script if not already loaded
    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
        setLoadError(undefined);
      };
      
      script.onerror = (error) => {
        const errorObj = error instanceof Error 
          ? error 
          : new Error(typeof error === 'string' ? error : 'Failed to load Google Maps API');
        
        setLoadError(errorObj);
        setIsLoaded(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      setIsLoaded(true);
    }
  }, []);

  const value = {
    isLoaded,
    loadError,
  };

  return (
    <GoogleMapApiContext.Provider value={value}>
      {children}
    </GoogleMapApiContext.Provider>
  );
}

export const useGoogleMapApi = (): GoogleMapApiContextType => {
  const context = useContext(GoogleMapApiContext);
  if (context === undefined) {
    throw new Error("useGoogleMapApi must be used within a GoogleMapApiProvider");
  }
  return context;
};

// Add this to help TypeScript with the google maps global
declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}
