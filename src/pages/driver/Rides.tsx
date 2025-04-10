
import { useState } from "react";
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
import { CalendarClock, MapPin, Navigation, User, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import RiderLocationMap from "@/components/maps/RiderLocationMap";

// Mock active ride for demonstration
const mockActiveRide: Ride = {
  id: "ride-123",
  riderId: "rider-456",
  driverId: "driver-789",
  status: "accepted",
  pickupLocation: {
    id: "loc-1",
    name: "Home",
    address: "123 Main St, Cotabato City",
    latitude: 7.2170,
    longitude: 124.2482,
  },
  dropoffLocation: {
    id: "loc-2",
    name: "Office",
    address: "456 Business Ave, Cotabato City",
    latitude: 7.2270,
    longitude: 124.2382,
  },
  scheduledTime: new Date(),
  fare: 120,
  distance: 5.2,
  paymentMethod: "gcash",
  paymentStatus: "pending",
  createdAt: new Date(),
};

export default function DriverRides() {
  const [activeRide, setActiveRide] = useState<Ride | null>(mockActiveRide);
  const { toast } = useToast();
  
  const handleAcceptRide = (ride: Ride) => {
    setActiveRide(ride);
    toast({
      title: "Ride Accepted",
      description: "You've successfully accepted this ride.",
    });
  };
  
  const handleRejectRide = () => {
    toast({
      title: "Ride Rejected",
      description: "You've rejected this ride request.",
    });
  };
  
  const handleCompleteRide = () => {
    setActiveRide(null);
    toast({
      title: "Ride Completed",
      description: "Great job! The ride has been completed.",
    });
  };
  
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
                    {new Date(activeRide.scheduledTime).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
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
                      <p className="text-muted-foreground">Maria Santos</p>
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
                  <Button 
                    className="flex-1" 
                    variant="default" 
                    onClick={handleCompleteRide}
                  >
                    Complete Ride
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                  >
                    Contact Rider
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <RiderLocationMap ride={activeRide} />
          </div>
        </div>
      ) : null}
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
          <TabsTrigger value="requests">Ride Requests</TabsTrigger>
          <TabsTrigger value="past">Past Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">You don't have any upcoming rides.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 border-b pb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarClock className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        April 25, 2023 - 2:30 PM
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
                          <p className="text-muted-foreground">789 Park Road, Cotabato City</p>
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
                          <p className="text-muted-foreground">321 Market Street, Cotabato City</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="text-lg font-bold">₱150.00</div>
                      <p className="text-sm text-muted-foreground">
                        Payment: Cash
                      </p>
                    </div>
                    
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleAcceptRide(mockActiveRide)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRejectRide}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 border-b pb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarClock className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        April 20, 2023 - 10:15 AM
                      </span>
                      <Badge variant="default">COMPLETED</Badge>
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
                          <p className="text-muted-foreground">Juan dela Cruz</p>
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
                          <p className="text-muted-foreground">123 Main St, Cotabato City</p>
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
                          <p className="text-muted-foreground">456 Business Ave, Cotabato City</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-lg font-bold">₱120.00</div>
                    <p className="text-sm text-muted-foreground">
                      Payment: GCash
                    </p>
                    <div className="mt-2 flex items-center">
                      <p className="text-sm mr-2">Rating:</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
