
import { Rider, Driver, Admin, Ride, Notification, DashboardStats } from "@/types";

// Mock Riders
export const riders: Rider[] = [
  {
    id: "r1",
    email: "juan@example.com",
    name: "Juan Dela Cruz",
    phone: "09123456789",
    role: "rider",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date("2023-01-15"),
    savedLocations: [
      {
        id: "loc1",
        name: "Home",
        address: "123 Mabini St, Cotabato City",
        latitude: 7.2132,
        longitude: 124.2450,
        type: "home"
      },
      {
        id: "loc2",
        name: "Office",
        address: "Cotabato City Hall, Cotabato City",
        latitude: 7.2107,
        longitude: 124.2486,
        type: "work"
      }
    ],
    paymentMethods: [
      {
        id: "pm1",
        type: "gcash",
        isDefault: true,
        details: { phoneNumber: "09123456789" }
      }
    ]
  },
  {
    id: "r2",
    email: "maria@example.com",
    name: "Maria Santos",
    phone: "09223456789",
    role: "rider",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    createdAt: new Date("2023-02-10"),
  }
];

// Mock Drivers
export const drivers: Driver[] = [
  {
    id: "d1",
    email: "pedro@example.com",
    name: "Pedro Penduko",
    phone: "09323456789",
    role: "driver",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    createdAt: new Date("2023-01-20"),
    vehicleInfo: {
      model: "Honda XRM 125",
      licensePlate: "ABC 123",
      color: "Black",
      year: "2022"
    },
    licenseDetails: {
      licenseNumber: "N01-12-345678",
      expiryDate: new Date("2027-01-20"),
      isVerified: true
    },
    isVerified: true,
    isAvailable: true,
    currentLocation: {
      id: "cl1",
      name: "Current Location",
      address: "Cotabato City Plaza",
      latitude: 7.2173,
      longitude: 124.2544
    },
    averageRating: 4.8
  },
  {
    id: "d2",
    email: "jose@example.com",
    name: "Jose Rizal",
    phone: "09423456789",
    role: "driver",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    createdAt: new Date("2023-03-05"),
    vehicleInfo: {
      model: "Yamaha Mio i125",
      licensePlate: "XYZ 789",
      color: "Blue",
      year: "2023"
    },
    licenseDetails: {
      licenseNumber: "N01-15-678901",
      expiryDate: new Date("2026-03-05"),
      isVerified: true
    },
    isVerified: true,
    isAvailable: false,
    averageRating: 4.5
  }
];

// Mock Admin
export const admins: Admin[] = [
  {
    id: "a1",
    email: "admin@example.com",
    name: "Admin User",
    phone: "09523456789",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    createdAt: new Date("2023-01-01"),
    permissions: ["manage_users", "manage_drivers", "manage_rides", "manage_payments"]
  }
];

// Mock Rides
export const rides: Ride[] = [
  {
    id: "ride1",
    riderId: "r1",
    driverId: "d1",
    status: "completed",
    pickupLocation: {
      id: "pl1",
      name: "Home",
      address: "123 Mabini St, Cotabato City",
      latitude: 7.2132,
      longitude: 124.2450
    },
    dropoffLocation: {
      id: "dl1",
      name: "Office",
      address: "Cotabato City Hall, Cotabato City",
      latitude: 7.2107,
      longitude: 124.2486
    },
    scheduledTime: new Date("2023-04-15T08:00:00"),
    actualPickupTime: new Date("2023-04-15T08:05:00"),
    actualDropoffTime: new Date("2023-04-15T08:20:00"),
    fare: 80,
    distance: 2.5,
    paymentMethod: "gcash",
    paymentStatus: "completed",
    rating: 5,
    review: "Great ride, very punctual!",
    createdAt: new Date("2023-04-14T14:00:00")
  },
  {
    id: "ride2",
    riderId: "r1",
    driverId: "d2",
    status: "completed",
    pickupLocation: {
      id: "pl2",
      name: "Office",
      address: "Cotabato City Hall, Cotabato City",
      latitude: 7.2107,
      longitude: 124.2486
    },
    dropoffLocation: {
      id: "dl2",
      name: "Home",
      address: "123 Mabini St, Cotabato City",
      latitude: 7.2132,
      longitude: 124.2450
    },
    scheduledTime: new Date("2023-04-15T17:00:00"),
    actualPickupTime: new Date("2023-04-15T17:03:00"),
    actualDropoffTime: new Date("2023-04-15T17:18:00"),
    fare: 80,
    distance: 2.5,
    paymentMethod: "cash",
    paymentStatus: "completed",
    rating: 4,
    review: "Good ride, nice driver",
    createdAt: new Date("2023-04-15T11:00:00")
  },
  {
    id: "ride3",
    riderId: "r2",
    status: "searching",
    pickupLocation: {
      id: "pl3",
      name: "Mall",
      address: "Cotabato Shopping Center, Cotabato City",
      latitude: 7.2156,
      longitude: 124.2467
    },
    dropoffLocation: {
      id: "dl3",
      name: "Hospital",
      address: "Cotabato Regional Medical Center, Cotabato City",
      latitude: 7.2198,
      longitude: 124.2508
    },
    scheduledTime: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes from now
    fare: 60,
    distance: 1.8,
    paymentMethod: "paymaya",
    paymentStatus: "pending",
    createdAt: new Date(Date.now())
  }
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: "n1",
    userId: "r1",
    title: "Ride Completed",
    message: "Your ride with Pedro has been completed. Please rate your experience.",
    type: "success",
    isRead: false,
    createdAt: new Date("2023-04-15T08:20:00")
  },
  {
    id: "n2",
    userId: "d1",
    title: "New Ride Request",
    message: "You have a new ride request from Maria Santos.",
    type: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  }
];

// Mock Dashboard Stats
export const dashboardStats: {
  rider: DashboardStats;
  driver: DashboardStats;
  admin: DashboardStats;
} = {
  rider: {
    totalRides: 5,
    completedRides: 4,
    cancelledRides: 1,
    totalEarnings: 0, // Riders don't earn
    averageRating: 0 // Riders don't get rated
  },
  driver: {
    totalRides: 12,
    completedRides: 10,
    cancelledRides: 2,
    totalEarnings: 920,
    averageRating: 4.8
  },
  admin: {
    totalRides: 150,
    completedRides: 142,
    cancelledRides: 8,
    totalEarnings: 12500,
    averageRating: 4.7
  }
};

// Helper function to find a user by email (for auth)
export function findUserByEmail(email: string): Rider | Driver | Admin | undefined {
  return [...riders, ...drivers, ...admins].find(user => user.email === email);
}

// Helper to get rides for a specific user
export function getRidesForUser(userId: string): Ride[] {
  return rides.filter(ride => ride.riderId === userId || ride.driverId === userId);
}
