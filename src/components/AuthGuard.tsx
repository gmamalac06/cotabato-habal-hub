
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthGuard - Auth state:", { user, isLoading, path: location.pathname });
  }, [user, isLoading, location.pathname]);

  if (isLoading) {
    console.log("AuthGuard - Still loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    console.log("AuthGuard - No user, redirecting to /login");
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
    console.log(`AuthGuard - User role ${user.role} not allowed, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated and authorized, render the children
  console.log("AuthGuard - User authenticated and authorized");
  return <>{children}</>;
};

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log("GuestGuard - Auth state:", { user, isLoading, path: location.pathname });
  }, [user, isLoading, location.pathname]);
  
  if (isLoading) {
    console.log("GuestGuard - Still loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
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
    console.log(`GuestGuard - User logged in with role ${user.role}, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // If user is not authenticated, render the children
  console.log("GuestGuard - No user, showing login/register page");
  return <>{children}</>;
};
