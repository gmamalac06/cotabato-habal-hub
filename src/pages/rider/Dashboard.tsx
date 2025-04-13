
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RiderStatsCards from "@/components/rider/RiderStatsCards";
import RecentBookingsTable, { BookingTableItem } from "@/components/rider/RecentBookingsTable";
import QuickActions from "@/components/rider/QuickActions";
import { User } from "@/types";
import { useStatistics } from "@/hooks/useStatistics";
import { useRides } from "@/hooks/useRides";

const RiderDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { stats, loading: statsLoading } = useStatistics();
  const { rides, loading: ridesLoading } = useRides({ role: 'rider' });
  const [recentBookings, setRecentBookings] = useState<BookingTableItem[]>([]);

  // Format rides data for the RecentBookingsTable
  useEffect(() => {
    if (rides && rides.length > 0) {
      const formattedBookings: BookingTableItem[] = rides.map(ride => ({
        date: new Date(ride.createdAt).toLocaleDateString(),
        driver: ride.driverId ? 'Assigned Driver' : 'Unassigned',
        from: ride.pickupLocation.address,
        to: ride.dropoffLocation.address,
        fare: `₱${ride.fare}`,
        status: ride.status.charAt(0).toUpperCase() + ride.status.slice(1).replace('_', ' ')
      }));
      
      setRecentBookings(formattedBookings);
    }
  }, [rides]);

  const handleProfilePictureUpload = async (imageUrl: string) => {
    if (user) {
      // Save the avatar URL to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: imageUrl }) // Use the new avatar_url column
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Error updating profile picture",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      updateUserProfile({ 
        ...user, 
        avatar: imageUrl // Keep this for backward compatibility
      });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <RiderStatsCards 
          totalRides={stats.totalRides} 
          completedRides={stats.completedRides} 
          cancelledRides={stats.cancelledRides}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <RecentBookingsTable bookings={recentBookings} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiderDashboard;
