
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are allowed roles specified and the user's role is not included
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on user role
    let redirectPath = "/";
    switch (user.role) {
      case "rider":
        redirectPath = "/rider";
        break;
      case "driver":
        redirectPath = "/driver";
        break;
      case "admin":
        redirectPath = "/admin";
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated and authorized, render the children
  return <>{children}</>;
};

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    let redirectPath = "/";
    switch (user.role) {
      case "rider":
        redirectPath = "/rider";
        break;
      case "driver":
        redirectPath = "/driver";
        break;
      case "admin":
        redirectPath = "/admin";
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  // If user is not authenticated, render the children
  return <>{children}</>;
};
