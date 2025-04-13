
export type UserRole = "rider" | "driver" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string | null;
}

export interface Booking {
  id: string;
  riderId: string;
  driverId: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  fare: number;
  createdAt: string;
  scheduledFor?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface RouteInfo {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  fare: number;
}
