
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RiderStatsCards from "@/components/rider/RiderStatsCards";
import RecentBookingsTable from "@/components/rider/RecentBookingsTable";
import QuickActions from "@/components/rider/QuickActions";
import { User } from "@/types";

const RiderDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();

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
        
        <RiderStatsCards />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <RecentBookingsTable />
          </div>
          <div>
            <QuickActions handleProfilePictureUpload={handleProfilePictureUpload} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiderDashboard;
