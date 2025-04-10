
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface GoogleMapApiContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyConfigured: boolean;
  // Add a global loader status
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapApiContext = createContext<GoogleMapApiContextType | undefined>(undefined);

interface GoogleMapApiProviderProps {
  children: ReactNode;
}

export function GoogleMapApiProvider({ children }: GoogleMapApiProviderProps) {
  // Try to get API key from localStorage first
  const [apiKey, setApiKey] = useState<string>(() => {
    const storedKey = localStorage.getItem("google_maps_api_key");
    return storedKey || "";
  });
  
  // Track loading status at the provider level
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);

  // Save the API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("google_maps_api_key", apiKey);
      
      // When API key changes, we need to reload the page to reinitialize the Google Maps loader
      if (window.google?.maps && isLoaded) {
        window.location.reload();
      }
    }
  }, [apiKey, isLoaded]);

  // Initialize loader globally if API key is present
  useEffect(() => {
    if (!apiKey) {
      setIsLoaded(false);
      return;
    }

    // Only load the script if API key is present and not already loaded
    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
        setLoadError(undefined);
      };
      
      script.onerror = (error) => {
        setLoadError(error as Error);
        setIsLoaded(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      setIsLoaded(true);
    }
  }, [apiKey]);

  const value = {
    apiKey,
    setApiKey,
    isKeyConfigured: Boolean(apiKey),
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
