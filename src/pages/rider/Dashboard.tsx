
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RiderStatsCards from "@/components/rider/RiderStatsCards";
import RecentBookingsTable from "@/components/rider/RecentBookingsTable";
import QuickActions from "@/components/rider/QuickActions";
import BookRideDialog from "@/components/rider/BookRideDialog";
import { dashboardStats } from "@/lib/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RiderDashboard() {
  const isMobile = useIsMobile();
  
  // Mock recent bookings data
  const recentBookings = [
    {
      date: "Apr 15, 2023",
      driver: "Pedro Penduko",
      from: "Home",
      to: "Office",
      fare: "₱80.00",
      status: "Completed" as const
    },
    {
      date: "Apr 15, 2023",
      driver: "Jose Rizal",
      from: "Office",
      to: "Home",
      fare: "₱80.00",
      status: "Completed" as const
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Habal Hub</p>
        </div>
        
        <BookRideDialog />
      </div>
      
      {/* Stats Cards */}
      <RiderStatsCards 
        totalRides={dashboardStats.rider.totalRides}
        completedRides={dashboardStats.rider.completedRides}
        cancelledRides={dashboardStats.rider.cancelledRides}
      />
      
      {/* Recent Bookings */}
      <RecentBookingsTable bookings={recentBookings} />
      
      {/* Quick Actions */}
      <QuickActions />
    </DashboardLayout>
  );
}
