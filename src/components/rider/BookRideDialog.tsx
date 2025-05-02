
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import LocationPicker from "@/components/maps/LocationPicker";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function BookRideDialog() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"manual" | "map">("manual");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { position: currentPosition, loading: loadingPosition, error: positionError } = useGeolocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const handleBookRide = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book a ride.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create/save pickup location
      const { data: pickupLocationData, error: pickupLocationError } = await supabase
        .from('locations')
        .insert({
          address: pickupLocation ? pickupLocation.address : pickup,
          latitude: pickupLocation ? pickupLocation.lat : 0,
          longitude: pickupLocation ? pickupLocation.lng : 0
        })
        .select();

      if (pickupLocationError) throw new Error(pickupLocationError.message);
      if (!pickupLocationData || pickupLocationData.length === 0) {
        throw new Error("Failed to create pickup location");
      }

      // Step 2: Create/save dropoff location
      const { data: dropoffLocationData, error: dropoffLocationError } = await supabase
        .from('locations')
        .insert({
          address: dropoffLocation ? dropoffLocation.address : dropoff,
          latitude: dropoffLocation ? dropoffLocation.lat : 0,
          longitude: dropoffLocation ? dropoffLocation.lng : 0
        })
        .select();

      if (dropoffLocationError) throw new Error(dropoffLocationError.message);
      if (!dropoffLocationData || dropoffLocationData.length === 0) {
        throw new Error("Failed to create dropoff location");
      }

      // Step 3: Calculate fare (in a real app, this would use distance/time)
      const fare = Math.floor(Math.random() * 200) + 50; // Random fare between 50-250 pesos

      // Step 4: Create the ride
      const { data: rideData, error: rideError } = await supabase
        .from('rides')
        .insert({
          rider_id: user.id,
          pickup_location_id: pickupLocationData[0].id,
          dropoff_location_id: dropoffLocationData[0].id,
          status: 'pending',
          fare: fare,
          payment_method: paymentMethod,
          scheduled_time: new Date().toISOString()
        })
        .select();

      if (rideError) throw new Error(rideError.message);

      toast({
        title: "Ride Booked!",
        description: "Your ride has been scheduled successfully.",
      });
      
      setIsBookingDialogOpen(false);
      
      // Reset form values
      setPickup("");
      setDropoff("");
      setPickupLocation(null);
      setDropoffLocation(null);
      
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickupSelected = (location: { lat: number; lng: number; address: string }) => {
    setPickupLocation(location);
    setPickup(location.address);
  };

  const handleDropoffSelected = (location: { lat: number; lng: number; address: string }) => {
    setDropoffLocation(location);
    setDropoff(location.address);
  };

  return (
    <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">Book a Ride</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book a Habal-Habal Ride</DialogTitle>
          <DialogDescription>
            Enter your ride details below to book a habal-habal.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="manual" onValueChange={(value) => setCurrentTab(value as "manual" | "map")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">Enter Address</TabsTrigger>
            <TabsTrigger value="map">Choose on Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="pickup" className="text-sm font-medium">Pickup Location</label>
              <Input 
                id="pickup" 
                placeholder="Enter pickup address" 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dropoff" className="text-sm font-medium">Dropoff Location</label>
              <Input 
                id="dropoff" 
                placeholder="Enter destination address" 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="py-2">
            <div className="space-y-6">
              <Tabs defaultValue="pickup">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="pickup">Set Pickup</TabsTrigger>
                  <TabsTrigger value="dropoff">Set Dropoff</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pickup">
                  <LocationPicker
                    type="pickup"
                    initialLocation={currentPosition || undefined}
                    onSelectLocation={handlePickupSelected}
                  />
                </TabsContent>
                
                <TabsContent value="dropoff">
                  <LocationPicker
                    type="dropoff"
                    onSelectLocation={handleDropoffSelected}
                  />
                </TabsContent>
              </Tabs>
              
              {/* Display selected locations */}
              {(pickupLocation || dropoffLocation) && (
                <div className="space-y-3 border rounded-md p-3 bg-secondary/50">
                  <h3 className="font-medium">Selected Locations</h3>
                  
                  {pickupLocation && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-green-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-xs text-muted-foreground break-words">{pickupLocation.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {dropoffLocation && (
                    <div className="flex items-start space-x-3">
                      <Navigation className="h-4 w-4 text-red-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Dropoff</p>
                        <p className="text-xs text-muted-foreground break-words">{dropoffLocation.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2 py-2">
          <label htmlFor="payment" className="text-sm font-medium">Payment Method</label>
          <Select 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gcash">GCash</SelectItem>
              <SelectItem value="paymaya">PayMaya</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookRide}
            disabled={isLoading || (currentTab === "manual" && (!pickup || !dropoff)) || 
                     (currentTab === "map" && (!pickupLocation || !dropoffLocation))}
          >
            {isLoading ? "Booking..." : "Book Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
