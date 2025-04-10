
export type UserRole = 'rider' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Rider extends User {
  role: 'rider';
  savedLocations?: Location[];
  paymentMethods?: PaymentMethod[];
}

export interface Driver extends User {
  role: 'driver';
  vehicleInfo: VehicleInfo;
  licenseDetails: LicenseDetails;
  isVerified: boolean;
  isAvailable: boolean;
  currentLocation?: Location;
  averageRating?: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
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

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type?: 'home' | 'work' | 'other';
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  status: RideStatus;
  pickupLocation: Location;
  dropoffLocation: Location;
  scheduledTime: Date;
  actualPickupTime?: Date;
  actualDropoffTime?: Date;
  fare: number;
  distance: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  rating?: number;
  review?: string;
  createdAt: Date;
}

export type RideStatus = 
  | 'searching' 
  | 'matched' 
  | 'accepted' 
  | 'arrived_pickup' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethodType = 'gcash' | 'paymaya' | 'cash';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  isDefault: boolean;
  details: GCashDetails | PayMayaDetails | {};
}

export interface GCashDetails {
  phoneNumber: string;
}

export interface PayMayaDetails {
  accountNumber: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
  averageRating: number;
}
