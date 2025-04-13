
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

// Add missing types for Ride, RideLocation, Rider, Driver, Admin, Notification, DashboardStats
export interface RideLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type?: "home" | "work" | "other";
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string | null;
  status: "searching" | "accepted" | "in_progress" | "completed" | "cancelled";
  pickupLocation: RideLocation;
  dropoffLocation: RideLocation;
  scheduledTime: Date;
  actualPickupTime?: Date;
  actualDropoffTime?: Date;
  fare: number;
  distance?: number;
  paymentMethod: "cash" | "gcash" | "paymaya" | "card";
  paymentStatus: "pending" | "completed" | "failed";
  rating?: number;
  review?: string;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: "gcash" | "paymaya" | "card" | "cash";
  isDefault: boolean;
  details?: any;
}

export interface Rider extends User {
  savedLocations?: RideLocation[];
  paymentMethods?: PaymentMethod[];
  createdAt: Date;
}

export interface VehicleInfo {
  model: string;
  licensePlate: string;
  color: string;
  year: string;
}

export interface LicenseDetails {
  licenseNumber: string;
  expiryDate: Date;
  isVerified: boolean;
}

export interface Driver extends User {
  vehicleInfo?: VehicleInfo;
  licenseDetails?: LicenseDetails;
  isVerified?: boolean;
  isAvailable?: boolean;
  currentLocation?: RideLocation;
  averageRating?: number;
  createdAt: Date;
}

export interface Admin extends User {
  permissions?: string[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings?: number;
  averageRating?: number;
}
