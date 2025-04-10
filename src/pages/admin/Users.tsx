
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { riders, drivers } from "@/lib/mock-data";
import { MoreHorizontal, Search, CheckCircle, XCircle, Shield, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("riders");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof riders[0] | typeof drivers[0] | null>(null);
  const { toast } = useToast();
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
  };
  
  const filteredRiders = riders.filter(rider => 
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUserDetails = (user: typeof riders[0] | typeof drivers[0]) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };
  
  const handleAction = (action: string, userId: string) => {
    let message = "";
    
    switch (action) {
      case "verify":
        message = "Driver has been verified successfully.";
        break;
      case "suspend":
        message = "User has been suspended.";
        break;
      case "delete":
        message = "User has been deleted.";
        break;
      case "edit":
        message = "User details updated successfully.";
        break;
    }
    
    toast({
      title: "Action Completed",
      description: message,
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage riders and drivers</p>
        </div>
        
        <div className="mt-4 md:mt-0 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10 w-full md:w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <Tabs defaultValue="riders" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="riders">Riders ({riders.length})</TabsTrigger>
          <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="riders">
          <Card>
            <CardHeader>
              <CardTitle>Registered Riders</CardTitle>
              <CardDescription>Manage all passenger accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Email</th>
                      <th scope="col" className="px-6 py-3">Phone</th>
                      <th scope="col" className="px-6 py-3">Registration Date</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRiders.length > 0 ? (
                      filteredRiders.map(rider => (
                        <tr key={rider.id} className="bg-card border-b">
                          <td className="px-6 py-4 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {rider.avatar ? (
                                <AvatarImage src={rider.avatar} alt={rider.name} />
                              ) : (
                                <AvatarFallback>{getInitials(rider.name)}</AvatarFallback>
                              )}
                            </Avatar>
                            {rider.name}
                          </td>
                          <td className="px-6 py-4">{rider.email}</td>
                          <td className="px-6 py-4">{rider.phone}</td>
                          <td className="px-6 py-4">
                            {new Date(rider.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUserDetails(rider)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction("edit", rider.id)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleAction("suspend", rider.id)}
                                  className="text-yellow-600"
                                >
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleAction("delete", rider.id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          No riders found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Registered Drivers</CardTitle>
              <CardDescription>Manage all driver accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Email</th>
                      <th scope="col" className="px-6 py-3">Phone</th>
                      <th scope="col" className="px-6 py-3">Vehicle</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.length > 0 ? (
                      filteredDrivers.map(driver => (
                        <tr key={driver.id} className="bg-card border-b">
                          <td className="px-6 py-4 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {driver.avatar ? (
                                <AvatarImage src={driver.avatar} alt={driver.name} />
                              ) : (
                                <AvatarFallback>{getInitials(driver.name)}</AvatarFallback>
                              )}
                            </Avatar>
                            {driver.name}
                          </td>
                          <td className="px-6 py-4">{driver.email}</td>
                          <td className="px-6 py-4">{driver.phone}</td>
                          <td className="px-6 py-4">
                            {driver.vehicleInfo.model} ({driver.vehicleInfo.color})
                          </td>
                          <td className="px-6 py-4">
                            {driver.isVerified ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" /> Verified
                              </div>
                            ) : (
                              <div className="flex items-center text-yellow-600">
                                <XCircle className="h-4 w-4 mr-1" /> Pending
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUserDetails(driver)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction("edit", driver.id)}>
                                  Edit
                                </DropdownMenuItem>
                                {!driver.isVerified && (
                                  <DropdownMenuItem 
                                    onClick={() => handleAction("verify", driver.id)}
                                    className="text-green-600"
                                  >
                                    Verify
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleAction("suspend", driver.id)}
                                  className="text-yellow-600"
                                >
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleAction("delete", driver.id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          No drivers found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    {selectedUser.avatar ? (
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">{getInitials(selectedUser.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <p className="mt-2 font-medium">{selectedUser.name}</p>
                  <p className="text-xs bg-secondary px-2 py-0.5 rounded-full capitalize">
                    {selectedUser.role}
                  </p>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                      <p>{selectedUser.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
                      <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    {selectedUser.role === 'driver' && (
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Vehicle Info</h3>
                          <p>{(selectedUser as typeof drivers[0]).vehicleInfo.model}, {(selectedUser as typeof drivers[0]).vehicleInfo.color}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">License Plate</h3>
                          <p>{(selectedUser as typeof drivers[0]).vehicleInfo.licensePlate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Verification Status</h3>
                          <p className={(selectedUser as typeof drivers[0]).isVerified ? "text-green-600" : "text-yellow-600"}>
                            {(selectedUser as typeof drivers[0]).isVerified ? "Verified" : "Pending Verification"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {selectedUser.role === 'driver' && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Driver License Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">License Number</h4>
                          <p>{(selectedUser as typeof drivers[0]).licenseDetails.licenseNumber}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Expiry Date</h4>
                          <p>{new Date((selectedUser as typeof drivers[0]).licenseDetails.expiryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => handleAction("edit", selectedUser.id)}>
                      Edit Details
                    </Button>
                    
                    {selectedUser.role === 'driver' && !(selectedUser as typeof drivers[0]).isVerified && (
                      <Button variant="default" onClick={() => handleAction("verify", selectedUser.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Driver
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
