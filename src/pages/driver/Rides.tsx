
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Ride } from "@/types";
import { CalendarClock, MapPin, Navigation, User, Clock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RiderLocationMap from "@/components/maps/RiderLocationMap";
import { useRides } from "@/hooks/useRides";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function DriverRides() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { rides: allRides, loading } = useRides({ role: 'driver' });
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  
  // Filter rides into different categories
  const pendingRides = allRides.filter(ride => ride.status === 'pending' && !ride.driverId);
  const acceptedRides = allRides.filter(ride => 
    (ride.status === 'accepted' || ride.status === 'in_progress') && 
    ride.driverId === user?.id
  );
  const pastRides = allRides.filter(ride => 
    (ride.status === 'completed' || ride.status === 'cancelled') && 
    ride.driverId === user?.id
  );

  // Set active ride (if any)
  useEffect(() => {
    const firstActiveRide = acceptedRides[0];
    if (firstActiveRide && !activeRide) {
      setActiveRide(firstActiveRide);
    } else if (activeRide && acceptedRides.length === 0) {
      setActiveRide(null);
    }
  }, [acceptedRides, activeRide]);
  
  const handleAcceptRide = async (ride: Ride) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          driver_id: user?.id,
          status: 'accepted'
        })
        .eq('id', ride.id);

      if (error) throw error;

      setActiveRide({
        ...ride,
        driverId: user?.id,
        status: 'accepted'
      });
      
      toast({
        title: "Ride Accepted",
        description: "You've successfully accepted this ride.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleStartRide = async (ride: Ride) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          status: 'in_progress',
          pickup_time: new Date().toISOString()
        })
        .eq('id', ride.id);

      if (error) throw error;

      setActiveRide({
        ...ride,
        status: 'in_progress',
        actualPickupTime: new Date()
      });
      
      toast({
        title: "Ride Started",
        description: "The ride has been started successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleCompleteRide = async (ride: Ride) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          status: 'completed',
          completed_time: new Date().toISOString()
        })
        .eq('id', ride.id);

      if (error) throw error;

      setActiveRide(null);
      
      toast({
        title: "Ride Completed",
        description: "Great job! The ride has been completed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleRejectRide = async (ride: Ride) => {
    try {
      toast({
        title: "Ride Rejected",
        description: "You've rejected this ride request.",
      });
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
          <p>Loading rides...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Rides</h1>
          <p className="text-muted-foreground">Manage your ride requests and ongoing trips</p>
        </div>
      </div>
      
      {activeRide ? (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Active Ride</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {formatDate(activeRide.scheduledTime)}
                  </span>
                  <Badge>
                    {activeRide.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Rider</p>
                      <p className="text-muted-foreground">Rider #{activeRide.riderId.substring(0, 8)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                        <MapPin className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Pickup</p>
                      <p className="text-muted-foreground">{activeRide.pickupLocation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                        <Navigation className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Dropoff</p>
                      <p className="text-muted-foreground">{activeRide.dropoffLocation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                        <Clock className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Estimated Duration</p>
                      <p className="text-muted-foreground">15 minutes</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-lg font-bold">₱{activeRide.fare.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">
                    Payment: {activeRide.paymentMethod.charAt(0).toUpperCase() + activeRide.paymentMethod.slice(1)}
                  </p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {activeRide.status === 'accepted' ? (
                    <Button 
                      className="flex-1" 
                      variant="default" 
                      onClick={() => handleStartRide(activeRide)}
                    >
                      Start Ride
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1" 
                      variant="default" 
                      onClick={() => handleCompleteRide(activeRide)}
                    >
                      Complete Ride
                    </Button>
                  )}
                  <Button 
                    className="flex-1" 
                    variant="outline"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Rider
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {activeRide && <RiderLocationMap ride={activeRide} />}
          </div>
        </div>
      ) : null}
      
      <Tabs defaultValue="requests" className="mb-8">
        <TabsList>
          <TabsTrigger value="requests">Ride Requests</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
          <TabsTrigger value="past">Past Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          {pendingRides.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {pendingRides.map((ride) => (
                    <div key={ride.id} className="flex flex-col md:flex-row gap-6 border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarClock className="h-5 w-5 text-primary" />
                          <span className="font-medium">
                            {formatDate(ride.scheduledTime)}
                          </span>
                          <Badge variant="outline">NEW REQUEST</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <MapPin className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Pickup</p>
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
                              <p className="font-medium">Dropoff</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="text-lg font-bold">₱{ride.fare.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">
                            Payment: {ride.paymentMethod.charAt(0).toUpperCase() + ride.paymentMethod.slice(1)}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleAcceptRide(ride)}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRejectRide(ride)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No new ride requests at this time.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {acceptedRides.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {acceptedRides.map((ride) => (
                    <div key={ride.id} className="flex flex-col md:flex-row gap-6 border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarClock className="h-5 w-5 text-primary" />
                          <span className="font-medium">
                            {formatDate(ride.scheduledTime)}
                          </span>
                          <Badge>{ride.status.toUpperCase()}</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <MapPin className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Pickup</p>
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
                              <p className="font-medium">Dropoff</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-bold">₱{ride.fare.toFixed(2)}</div>
                        <p className="text-sm text-muted-foreground">
                          Payment: {ride.paymentMethod.charAt(0).toUpperCase() + ride.paymentMethod.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don't have any upcoming rides.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastRides.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {pastRides.map((ride) => (
                    <div key={ride.id} className="flex flex-col md:flex-row gap-6 border-b pb-4 last:border-0 last:pb-0">
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
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                <User className="h-3 w-3" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Rider</p>
                              <p className="text-muted-foreground">Rider #{ride.riderId.substring(0, 8)}</p>
                            </div>
                          </div>
                          
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
                      
                      <div>
                        <div className="text-lg font-bold">₱{ride.fare.toFixed(2)}</div>
                        <p className="text-sm text-muted-foreground">
                          Payment: {ride.paymentMethod.charAt(0).toUpperCase() + ride.paymentMethod.slice(1)}
                        </p>
                        {ride.rating && (
                          <div className="mt-2 flex items-center">
                            <p className="text-sm mr-2">Rating:</p>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${i < (ride.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don't have any past rides.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
