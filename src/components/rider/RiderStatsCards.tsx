
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface RiderStatsCardsProps {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
}

export default function RiderStatsCards({
  totalRides,
  completedRides,
  cancelledRides,
}: RiderStatsCardsProps) {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      <Card>
        <CardHeader className={`flex flex-row items-center justify-between ${isMobile ? 'pb-2 pt-3 px-3' : 'pb-2'}`}>
          <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'pt-0 px-3 pb-3' : ''}>
          <div className="text-2xl font-bold">{totalRides}</div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime habal-habal bookings</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className={`flex flex-row items-center justify-between ${isMobile ? 'pb-2 pt-3 px-3' : 'pb-2'}`}>
          <CardTitle className="text-sm font-medium">Completed Rides</CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'pt-0 px-3 pb-3' : ''}>
          <div className="text-2xl font-bold">{completedRides}</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully completed rides</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className={`flex flex-row items-center justify-between ${isMobile ? 'pb-2 pt-3 px-3' : 'pb-2'}`}>
          <CardTitle className="text-sm font-medium">Cancelled Rides</CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'pt-0 px-3 pb-3' : ''}>
          <div className="text-2xl font-bold">{cancelledRides}</div>
          <p className="text-xs text-muted-foreground mt-1">Rides that were cancelled</p>
        </CardContent>
      </Card>
    </div>
  );
}
