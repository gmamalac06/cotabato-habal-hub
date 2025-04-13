
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarClock, Navigation, MapPin, User, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRides } from "@/hooks/useRides";
import { supabase } from "@/integrations/supabase/client";
import BookRideDialog from "@/components/rider/BookRideDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Ride } from "@/types";

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

export default function RiderBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { rides: allRides, loading } = useRides({ role: 'rider' });
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  
  const upcomingRides = allRides.filter(ride => 
    ride.status !== 'completed' && ride.status !== 'cancelled'
  );
  
  const pastRides = allRides.filter(ride => 
    ride.status === 'completed' || ride.status === 'cancelled'
  );
  
  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const handleCancelRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);

      if (error) throw error;

      toast({
        title: "Ride Cancelled",
        description: "Your ride has been cancelled successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleRateRide = (ride: Ride) => {
    setSelectedRide(ride);
    form.reset({
      rating: ride.rating || 0,
      review: ride.review || "",
    });
    setSelectedRating(ride.rating || 0);
    setIsRatingDialogOpen(true);
  };

  const onSubmitRating = async (values: RatingFormValues) => {
    if (!selectedRide) return;

    try {
      // Update ride with rating and review
      const { error } = await supabase
        .from('rides')
        .update({
          rating: values.rating,
          review: values.review || null,
        })
        .eq('id', selectedRide.id);

      if (error) throw error;

      // Also insert into reviews table
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          ride_id: selectedRide.id,
          reviewer_id: user?.id,
          reviewee_id: selectedRide.driverId,
          rating: values.rating,
          comment: values.review || null,
        });

      if (reviewError) throw reviewError;

      toast({
        title: "Thanks for your rating!",
        description: "Your feedback helps us improve our service.",
      });
      
      setIsRatingDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p>Loading your bookings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your habal-habal rides</p>
        </div>
        <BookRideDialog />
      </div>
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
          <TabsTrigger value="past">Past Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {upcomingRides.length > 0 ? (
            <div className="grid gap-4">
              {upcomingRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarClock className="h-5 w-5 text-primary" />
                          <span className="font-medium">
                            {formatDate(ride.scheduledTime)}
                          </span>
                          <Badge variant={ride.status === 'pending' ? 'outline' : 'default'}>
                            {ride.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <MapPin className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">From</p>
                              <p className="text-muted-foreground">{ride.pickupLocation.address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <Navigation className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">To</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end justify-between">
                        <div>
                          <div className="text-lg font-bold">₱{ride.fare.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">
                            Payment: {ride.paymentMethod.charAt(0).toUpperCase() + ride.paymentMethod.slice(1)}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleCancelRide(ride.id)}
                            disabled={ride.status === 'in_progress'}
                          >
                            Cancel Ride
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don't have any upcoming rides.</p>
                <BookRideDialog />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastRides.length > 0 ? (
            <div className="grid gap-4">
              {pastRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarClock className="h-5 w-5 text-primary" />
                          <span className="font-medium">
                            {formatDate(ride.scheduledTime)}
                          </span>
                          <Badge variant={ride.status === 'cancelled' ? 'destructive' : 'default'}>
                            {ride.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          {ride.driverId && (
                            <div className="flex items-start">
                              <div className="mt-1 mr-3">
                                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                  <User className="h-3 w-3" />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium">Driver</p>
                                <p className="text-muted-foreground">
                                  {ride.driverId ? "Driver #" + ride.driverId.substring(0, 8) : "N/A"}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <MapPin className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">From</p>
                              <p className="text-muted-foreground">{ride.pickupLocation.address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <Navigation className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">To</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation.address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <Clock className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Duration</p>
                              <p className="text-muted-foreground">
                                {ride.actualPickupTime && ride.actualDropoffTime 
                                  ? `15 minutes` 
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end justify-between">
                        <div>
                          <div className="text-lg font-bold">₱{ride.fare.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">
                            Payment: {ride.paymentMethod.charAt(0).toUpperCase() + ride.paymentMethod.slice(1)}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          {ride.status === 'completed' && !ride.rating ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRateRide(ride)}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Rate this Ride
                            </Button>
                          ) : ride.rating ? (
                            <div className="flex items-center">
                              <p className="text-sm mr-2">Your rating:</p>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < (ride.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don't have any past rides.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate your ride</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitRating)} className="space-y-6">
              <div className="flex justify-center py-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        star <= selectedRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedRating(star);
                        form.setValue('rating', star);
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Submit Rating</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
