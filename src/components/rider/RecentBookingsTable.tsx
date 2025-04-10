
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Later we can replace this with real data from the API
interface Booking {
  date: string;
  driver: string;
  from: string;
  to: string;
  fare: string;
  status: "Completed" | "Cancelled" | "Pending";
}

interface RecentBookingsTableProps {
  bookings: Booking[];
}

export default function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="mb-6">
      <CardHeader className={isMobile ? 'px-3 pt-3 pb-2' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
        <div className="relative overflow-x-auto rounded-md">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">Date</th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">Driver</th>
                <th scope="col" className={`px-4 py-2 md:px-6 md:py-3 ${isMobile ? 'hidden' : ''}`}>From</th>
                <th scope="col" className={`px-4 py-2 md:px-6 md:py-3 ${isMobile ? 'hidden' : ''}`}>To</th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">Fare</th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="bg-card border-b">
                  <td className="px-4 py-2 md:px-6 md:py-4">{booking.date}</td>
                  <td className="px-4 py-2 md:px-6 md:py-4">{booking.driver}</td>
                  <td className={`px-4 py-2 md:px-6 md:py-4 ${isMobile ? 'hidden' : ''}`}>{booking.from}</td>
                  <td className={`px-4 py-2 md:px-6 md:py-4 ${isMobile ? 'hidden' : ''}`}>{booking.to}</td>
                  <td className="px-4 py-2 md:px-6 md:py-4">{booking.fare}</td>
                  <td className="px-4 py-2 md:px-6 md:py-4">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === "Completed" ? "bg-green-100 text-green-800" : 
                        booking.status === "Cancelled" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
