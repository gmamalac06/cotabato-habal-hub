
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleMapApiProvider } from "@/contexts/GoogleMapApiProvider";
import { AuthGuard, GuestGuard } from "@/components/AuthGuard";

// Page imports
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import RiderDashboard from "@/pages/rider/Dashboard";
import DriverDashboard from "@/pages/driver/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import RiderBookings from "@/pages/rider/Bookings";
import DriverRides from "@/pages/driver/Rides";
import AdminUsers from "@/pages/admin/Users";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// This component wraps the AuthProvider with the Router context available
const AppWithAuth = () => {
  const navigate = useNavigate(); // Now this is safe to use
  
  return (
    <AuthProvider navigate={(path) => navigate(path)}>
      <GoogleMapApiProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth routes */}
            <Route 
              path="/login" 
              element={
                <GuestGuard>
                  <Login />
                </GuestGuard>
              } 
            />
            <Route 
              path="/register" 
              element={
                <GuestGuard>
                  <Register />
                </GuestGuard>
              } 
            />

            {/* Rider routes */}
            <Route 
              path="/rider" 
              element={
                <AuthGuard allowedRoles={['rider']}>
                  <RiderDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/rider/bookings" 
              element={
                <AuthGuard allowedRoles={['rider']}>
                  <RiderBookings />
                </AuthGuard>
              } 
            />

            {/* Driver routes */}
            <Route 
              path="/driver" 
              element={
                <AuthGuard allowedRoles={['driver']}>
                  <DriverDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/driver/rides" 
              element={
                <AuthGuard allowedRoles={['driver']}>
                  <DriverRides />
                </AuthGuard>
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <AuthGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AuthGuard allowedRoles={['admin']}>
                  <AdminUsers />
                </AuthGuard>
              } 
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </GoogleMapApiProvider>
    </AuthProvider>
  );
};

// Main App component with correct component hierarchy
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
