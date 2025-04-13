
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RiderStatsCards from "@/components/rider/RiderStatsCards";
import RecentBookingsTable, { BookingTableItem } from "@/components/rider/RecentBookingsTable";
import QuickActions from "@/components/rider/QuickActions";
import BookRideDialog from "@/components/rider/BookRideDialog";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useStatistics } from "@/hooks/useStatistics";
import { useRides } from "@/hooks/useRides";
import { supabase } from "@/integrations/supabase/client";

export default function RiderDashboard() {
  const isMobile = useIsMobile();
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { stats, loading: statsLoading } = useStatistics();
  const { rides, loading: ridesLoading } = useRides({ 
    role: 'rider',
    status: ['completed'] 
  });
  
  // Format rides data for recent bookings table
  const recentBookings: BookingTableItem[] = rides.slice(0, 5).map(ride => ({
    date: ride.scheduledTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    driver: ride.driverId ? `Driver #${ride.driverId.substring(0, 8)}` : 'N/A',
    from: ride.pickupLocation.address.split(',')[0],
    to: ride.dropoffLocation.address.split(',')[0],
    fare: `₱${ride.fare.toFixed(2)}`,
    status: ride.status === 'completed' ? 'Completed' : 
            ride.status === 'cancelled' ? 'Cancelled' : 'Pending'
  }));

  const handleProfilePictureUpload = async (imageUrl: string) => {
    if (user) {
      // Save the avatar URL to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: imageUrl })
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Error updating profile picture",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      updateUserProfile({ ...user, avatar: imageUrl });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    }
  };

  if (statsLoading || ridesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center mb-8">
        {!isMobile && user && (
          <ProfilePictureUpload 
            currentAvatar={user.avatar} 
            name={user.name} 
            onUpload={handleProfilePictureUpload} 
          />
        )}
        
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Habal Hub</p>
        </div>
        
        <BookRideDialog />
      </div>
      
      {/* Stats Cards */}
      <RiderStatsCards 
        totalRides={stats.totalRides}
        completedRides={stats.completedRides}
        cancelledRides={stats.cancelledRides}
      />
      
      {/* Recent Bookings */}
      <RecentBookingsTable bookings={recentBookings} />
      
      {/* Quick Actions */}
      <QuickActions />
    </DashboardLayout>
  );
}
