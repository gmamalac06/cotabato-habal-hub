
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function QuickActions() {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader className={isMobile ? 'px-3 pt-3 pb-2' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule a Ride
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="justify-start">
            View Saved Locations
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="justify-start">
            Manage Payment Methods
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
