
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface GoogleMapApiContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyConfigured: boolean;
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

  // Save the API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("google_maps_api_key", apiKey);
    }
  }, [apiKey]);

  const value = {
    apiKey,
    setApiKey,
    isKeyConfigured: Boolean(apiKey),
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
