
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { dashboardStats } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

export default function RiderDashboard() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const { toast } = useToast();

  const handleBookRide = () => {
    // In a real app, this would send data to the backend
    toast({
      title: "Ride Booked!",
      description: "Your ride has been scheduled successfully.",
    });
    setIsBookingDialogOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Habal Hub</p>
        </div>
        
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">Book a Ride</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a Habal-Habal Ride</DialogTitle>
              <DialogDescription>
                Enter your ride details below to book a habal-habal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
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
              
              <div className="space-y-2">
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
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookRide}>
                Book Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.rider.totalRides}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime habal-habal bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.rider.completedRides}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully completed rides</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.rider.cancelledRides}</div>
            <p className="text-xs text-muted-foreground mt-1">Rides that were cancelled</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Driver</th>
                  <th scope="col" className="px-6 py-3">From</th>
                  <th scope="col" className="px-6 py-3">To</th>
                  <th scope="col" className="px-6 py-3">Fare</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-card border-b">
                  <td className="px-6 py-4">Apr 15, 2023</td>
                  <td className="px-6 py-4">Pedro Penduko</td>
                  <td className="px-6 py-4">Home</td>
                  <td className="px-6 py-4">Office</td>
                  <td className="px-6 py-4">₱80.00</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="bg-card border-b">
                  <td className="px-6 py-4">Apr 15, 2023</td>
                  <td className="px-6 py-4">Jose Rizal</td>
                  <td className="px-6 py-4">Office</td>
                  <td className="px-6 py-4">Home</td>
                  <td className="px-6 py-4">₱80.00</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule a Ride
            </Button>
            <Button variant="outline" className="justify-start">
              View Saved Locations
            </Button>
            <Button variant="outline" className="justify-start">
              Manage Payment Methods
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
