
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ride } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UseRidesOptions {
  status?: string | string[];
  role?: 'rider' | 'driver';
}

export function useRides(options: UseRidesOptions = {}) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRides = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        let query = supabase
          .from('rides')
          .select(`
            *,
            pickup_location:pickup_location_id(id, address, latitude, longitude),
            dropoff_location:dropoff_location_id(id, address, latitude, longitude)
          `);

        // Filter by role (rider or driver)
        if (options.role === 'rider') {
          query = query.eq('rider_id', user.id);
        } else if (options.role === 'driver') {
          query = query.or(`driver_id.eq.${user.id},driver_id.is.null`);
        }

        // Filter by status if provided
        if (options.status) {
          if (Array.isArray(options.status)) {
            query = query.in('status', options.status);
          } else {
            query = query.eq('status', options.status);
          }
        }

        // Order by creation date, newest first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Transform the data to match our Ride type
        const formattedRides: Ride[] = data.map((ride: any) => ({
          id: ride.id,
          riderId: ride.rider_id,
          driverId: ride.driver_id,
          status: ride.status,
          pickupLocation: {
            id: ride.pickup_location.id,
            address: ride.pickup_location.address,
            latitude: ride.pickup_location.latitude,
            longitude: ride.pickup_location.longitude,
            name: ''
          },
          dropoffLocation: {
            id: ride.dropoff_location.id,
            address: ride.dropoff_location.address,
            latitude: ride.dropoff_location.latitude,
            longitude: ride.dropoff_location.longitude,
            name: ''
          },
          scheduledTime: new Date(ride.scheduled_time),
          actualPickupTime: ride.pickup_time ? new Date(ride.pickup_time) : undefined,
          actualDropoffTime: ride.completed_time ? new Date(ride.completed_time) : undefined,
          fare: ride.fare,
          distance: ride.distance,
          paymentMethod: ride.payment_method || 'cash',
          paymentStatus: 'pending',
          rating: ride.rating,
          review: ride.review,
          createdAt: new Date(ride.created_at),
        }));

        setRides(formattedRides);
      } catch (error: any) {
        toast({
          title: 'Error fetching rides',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user, options.status, options.role]);

  return { rides, loading };
}
