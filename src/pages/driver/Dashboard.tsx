
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { dashboardStats } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";
import { 
  MotorcycleIcon, 
  Users, 
  MapPin, 
  Navigation, 
  CalendarClock, 
  Star
} from "lucide-react";

export default function DriverDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const { toast } = useToast();
  
  const handleAvailabilityChange = (value: boolean) => {
    setIsAvailable(value);
    toast({
      title: value ? "You're now available for rides" : "You're now offline",
      description: value 
        ? "You'll start receiving ride requests." 
        : "You won't receive any ride requests until you go online again.",
    });
  };
  
  const handleAcceptRide = () => {
    toast({
      title: "Ride Accepted",
      description: "You've accepted the ride request. Head to the pickup location.",
    });
  };
  
  const handleDeclineRide = () => {
    toast({
      title: "Ride Declined",
      description: "You've declined the ride request.",
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Manage your rides and earnings</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="availability" 
              checked={isAvailable}
              onCheckedChange={handleAvailabilityChange}
            />
            <Label htmlFor="availability">
              {isAvailable ? "Available for Rides" : "Offline"}
            </Label>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <MotorcycleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱320.00</div>
            <p className="text-xs text-muted-foreground mt-1">From 4 completed rides</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.driver.totalRides}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <Progress className="h-2 mt-2" value={92} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.driver.averageRating}</div>
            <div className="flex mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New Ride Requests & Upcoming Rides */}
      <Tabs defaultValue="requests" className="mb-8">
        <TabsList>
          <TabsTrigger value="requests">
            New Requests
            <Badge variant="outline" className="ml-2 bg-primary text-white">1</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {new Date().toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                    <Badge>NEW REQUEST</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                          <Users className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Passenger</p>
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
                        <p className="text-muted-foreground">Cotabato Shopping Center, Cotabato City</p>
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
                        <p className="text-muted-foreground">Cotabato Regional Medical Center, Cotabato City</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">₱60.00</div>
                    <p className="text-sm text-muted-foreground">Est. distance: 1.8 km</p>
                    <p className="text-sm text-muted-foreground">Payment: PayMaya</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={handleDeclineRide}>
                      Decline
                    </Button>
                    <Button size="sm" onClick={handleAcceptRide}>
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">You don't have any upcoming rides.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Rides Completed</h3>
              <p className="text-2xl font-bold">4</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Online Hours</h3>
              <p className="text-2xl font-bold">6.5</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Distance</h3>
              <p className="text-2xl font-bold">12.4 km</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg. Rating</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">4.8</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
