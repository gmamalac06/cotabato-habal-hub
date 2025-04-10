
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarClock, Navigation, MapPin, User, Clock, Banknote } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DriverRides() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleArrived = () => {
    toast({
      title: "Arrival Confirmed",
      description: "You've marked that you've arrived at the pickup location.",
    });
  };
  
  const handleStartRide = () => {
    toast({
      title: "Ride Started",
      description: "You've started the ride. Drive safely!",
    });
  };
  
  const handleCompleteRide = () => {
    toast({
      title: "Ride Completed",
      description: "You've completed the ride. Thank you!",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Rides</h1>
          <p className="text-muted-foreground">Manage your upcoming and past rides</p>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming & Active</TabsTrigger>
          <TabsTrigger value="past">Past Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                Active Ride
                <Badge className="ml-2 bg-green-500">IN PROGRESS</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Passenger</p>
                        <p className="text-muted-foreground">Juan Dela Cruz</p>
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
                        <p className="text-muted-foreground">123 Mabini St, Cotabato City</p>
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
                        <p className="text-muted-foreground">Cotabato City Hall, Cotabato City</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                          <Banknote className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Payment</p>
                        <p className="text-muted-foreground">Cash</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">₱80.00</div>
                    <p className="text-sm text-muted-foreground">Est. distance: 2.5 km</p>
                  </div>
                  
                  <div className="mt-4">
                    <Button onClick={handleCompleteRide}>
                      Complete Ride
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {new Date(Date.now() + 1000 * 60 * 60).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        <Badge variant="outline">SCHEDULED</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="mt-1 mr-3">
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                              <User className="h-3 w-3" />
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
                        <div className="text-lg font-bold">₱60.00</div>
                        <p className="text-sm text-muted-foreground">Est. distance: 1.8 km</p>
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" size="sm" onClick={handleArrived}>
                          Mark as Arrived
                        </Button>
                      </div>
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
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          Apr 15, 2023, 8:00 AM
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
                            <p className="font-medium">Passenger</p>
                            <p className="text-muted-foreground">Juan Dela Cruz</p>
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
                            <p className="text-muted-foreground">123 Mabini St, Cotabato City</p>
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
                            <p className="text-muted-foreground">Cotabato City Hall, Cotabato City</p>
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
                            <p className="text-muted-foreground">15 minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end justify-between">
                      <div>
                        <div className="text-lg font-bold">₱80.00</div>
                        <p className="text-sm text-muted-foreground">Distance: 2.5 km</p>
                        <div className="mt-2 flex">
                          <p className="text-sm mr-2">Rating:</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
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
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          Apr 15, 2023, 5:00 PM
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
                            <p className="font-medium">Passenger</p>
                            <p className="text-muted-foreground">Juan Dela Cruz</p>
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
                            <p className="text-muted-foreground">Cotabato City Hall, Cotabato City</p>
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
                            <p className="text-muted-foreground">123 Mabini St, Cotabato City</p>
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
                            <p className="text-muted-foreground">15 minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end justify-between">
                      <div>
                        <div className="text-lg font-bold">₱80.00</div>
                        <p className="text-sm text-muted-foreground">Distance: 2.5 km</p>
                        <div className="mt-2 flex">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
