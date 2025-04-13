
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BookRideDialog from "./BookRideDialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LocationPicker from "@/components/maps/LocationPicker";

const savedLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
  is_home: z.boolean().optional(),
  is_work: z.boolean().optional(),
});

type SavedLocationFormValues = z.infer<typeof savedLocationSchema>;

const paymentMethodSchema = z.object({
  type: z.enum(["gcash", "paymaya", "cash"]),
  is_default: z.boolean().optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export default function QuickActions() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const locationForm = useForm<SavedLocationFormValues>({
    resolver: zodResolver(savedLocationSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      is_home: false,
      is_work: false,
    },
  });

  const paymentForm = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "gcash",
      is_default: true,
    },
  });

  const handleLocationSelected = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    locationForm.setValue("address", location.address);
    locationForm.setValue("latitude", location.lat);
    locationForm.setValue("longitude", location.lng);
  };

  const onSaveLocation = async (values: SavedLocationFormValues) => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please log in to save locations."
      });
      return;
    }

    try {
      // Insert the saved location
      const { error } = await supabase
        .from('saved_locations')
        .insert({
          user_id: user.id,
          name: values.name,
          address: values.address,
          latitude: values.latitude,
          longitude: values.longitude,
          is_home: values.is_home || false,
          is_work: values.is_work || false,
        });

      if (error) throw error;

      toast({
        title: "Location saved",
        description: "Your location has been saved successfully."
      });

      setIsLocationDialogOpen(false);
      locationForm.reset();
      setSelectedLocation(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const onSavePaymentMethod = async (values: PaymentMethodFormValues) => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please log in to save payment methods."
      });
      return;
    }

    try {
      // If this is set as default, first update all existing methods to non-default
      if (values.is_default) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      // Insert the new payment method
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: values.type,
          is_default: values.is_default || false,
        });

      if (error) throw error;

      toast({
        title: "Payment method added",
        description: "Your payment method has been saved successfully."
      });

      setIsPaymentSheetOpen(false);
      paymentForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className={isMobile ? 'px-3 pt-3 pb-2' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <BookRideDialog />
          
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className="justify-start"
            onClick={() => setIsLocationDialogOpen(true)}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Save Location
          </Button>
          
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className="justify-start"
            onClick={() => setIsPaymentSheetOpen(true)}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </CardContent>

      {/* Save Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Save Location</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 mb-6">
            <LocationPicker
              type="location"
              onSelectLocation={handleLocationSelected}
            />
          </div>
          
          <Form {...locationForm}>
            <form onSubmit={locationForm.handleSubmit(onSaveLocation)} className="space-y-4">
              <FormField
                control={locationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Home, Work, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={locationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={locationForm.control}
                name="is_home"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Set as Home
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={locationForm.control}
                name="is_work"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Set as Work
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={!selectedLocation}>Save Location</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Payment Method Sheet */}
      <Sheet open={isPaymentSheetOpen} onOpenChange={setIsPaymentSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Payment Method</SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onSavePaymentMethod)} className="space-y-6">
                <FormField
                  control={paymentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="gcash" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              GCash
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="paymaya" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              PayMaya
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={paymentForm.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Set as default payment method
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Add Payment Method
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
