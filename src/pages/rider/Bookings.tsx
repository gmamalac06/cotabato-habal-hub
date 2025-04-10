
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getRidesForUser } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarClock, Navigation, MapPin, User, Clock, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function RiderBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get rides for the current user
  const rides = user ? getRidesForUser(user.id) : [];
  
  const upcomingRides = rides.filter(ride => 
    ride.status !== 'completed' && ride.status !== 'cancelled'
  );
  
  const pastRides = rides.filter(ride => 
    ride.status === 'completed' || ride.status === 'cancelled'
  );
  
  const handleCancelRide = (rideId: string) => {
    toast({
      title: "Ride Cancelled",
      description: "Your ride has been cancelled successfully.",
    });
  };
  
  const handleRateRide = (rideId: string) => {
    toast({
      title: "Thanks for your rating!",
      description: "Your feedback helps us improve our service.",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your habal-habal rides</p>
        </div>
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
                            {new Date(ride.scheduledTime).toLocaleString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <Badge variant={ride.status === 'searching' ? 'outline' : 'default'}>
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
                          <Button variant="destructive" size="sm" onClick={() => handleCancelRide(ride.id)}>
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
                <Button className="mt-4">Book a Ride</Button>
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
                            {new Date(ride.scheduledTime).toLocaleString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
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
                              <p className="font-medium">Driver</p>
                              <p className="text-muted-foreground">
                                {ride.driverId ? "Pedro Penduko" : "N/A"}
                              </p>
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
                            <Button variant="outline" size="sm" onClick={() => handleRateRide(ride.id)}>
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
    </DashboardLayout>
  );
}
