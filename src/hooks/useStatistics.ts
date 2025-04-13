
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings?: number;
  averageRating?: number;
}

export function useStatistics() {
  const [stats, setStats] = useState<RideStats>({
    totalRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get total rides
        const { data: totalRidesData, error: totalRidesError } = await supabase
          .from('rides')
          .select('id', { count: 'exact' })
          .eq(user.role === 'rider' ? 'rider_id' : 'driver_id', user.id);

        if (totalRidesError) throw totalRidesError;
        
        // Get completed rides
        const { data: completedRidesData, error: completedRidesError } = await supabase
          .from('rides')
          .select('id', { count: 'exact' })
          .eq(user.role === 'rider' ? 'rider_id' : 'driver_id', user.id)
          .eq('status', 'completed');

        if (completedRidesError) throw completedRidesError;
        
        // Get cancelled rides
        const { data: cancelledRidesData, error: cancelledRidesError } = await supabase
          .from('rides')
          .select('id', { count: 'exact' })
          .eq(user.role === 'rider' ? 'rider_id' : 'driver_id', user.id)
          .eq('status', 'cancelled');

        if (cancelledRidesError) throw cancelledRidesError;
        
        // For drivers, get total earnings and average rating
        let totalEarnings = 0;
        let averageRating = 0;
        
        if (user.role === 'driver') {
          // Get total earnings
          const { data: earningsData, error: earningsError } = await supabase
            .from('rides')
            .select('fare')
            .eq('driver_id', user.id)
            .eq('status', 'completed');

          if (earningsError) throw earningsError;
          
          totalEarnings = earningsData.reduce((sum, ride) => sum + Number(ride.fare), 0);
          
          // Get average rating
          const { data: ratingsData, error: ratingsError } = await supabase
            .from('reviews')
            .select('rating')
            .eq('reviewee_id', user.id);

          if (ratingsError) throw ratingsError;
          
          const validRatings = ratingsData.filter(r => r.rating);
          averageRating = validRatings.length > 0 
            ? validRatings.reduce((sum, review) => sum + review.rating, 0) / validRatings.length 
            : 0;
        }

        setStats({
          totalRides: totalRidesData.length,
          completedRides: completedRidesData.length,
          cancelledRides: cancelledRidesData.length,
          totalEarnings: user.role === 'driver' ? totalEarnings : undefined,
          averageRating: user.role === 'driver' ? averageRating : undefined,
        });
        
      } catch (error: any) {
        toast({
          title: 'Error fetching statistics',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
}
