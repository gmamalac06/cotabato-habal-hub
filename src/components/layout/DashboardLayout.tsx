
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { 
  Bike, 
  Home, 
  Calendar, 
  Clock, 
  CreditCard, 
  Star, 
  Settings, 
  Users, 
  LogOut, 
  MessageSquare, 
  BarChart3, 
  Bell,
  Camera,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { useIsMobile } from "@/hooks/use-mobile";
import { BackButton } from "@/components/ui/back-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBasedNavItems = (): NavItem[] => {
    switch (user.role) {
      case "rider":
        return [
          { icon: Home, label: "Dashboard", href: "/rider" },
          { icon: Calendar, label: "My Bookings", href: "/rider/bookings" },
          { icon: CreditCard, label: "Payment Methods", href: "/rider/payments" },
          { icon: Star, label: "Rating & Reviews", href: "/rider/ratings" },
        ];
      case "driver":
        return [
          { icon: Home, label: "Dashboard", href: "/driver" },
          { icon: Clock, label: "My Rides", href: "/driver/rides" },
          { icon: CreditCard, label: "Earnings", href: "/driver/earnings" },
          { icon: Star, label: "Ratings", href: "/driver/ratings" },
        ];
      case "admin":
        return [
          { icon: Home, label: "Dashboard", href: "/admin" },
          { icon: Users, label: "Users", href: "/admin/users" },
          { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
          { icon: CreditCard, label: "Payments", href: "/admin/payments" },
          { icon: BarChart3, label: "Reports", href: "/admin/reports" },
          { icon: Settings, label: "Settings", href: "/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const navItems = getRoleBasedNavItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleProfilePictureUpload = (imageUrl: string) => {
    if (user) {
      updateUserProfile({ ...user, avatar: imageUrl });
      if (isMobile) {
        setProfileDialogOpen(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Sidebar */}
      <aside className={`${isMobile ? 'hidden' : 'block'} w-64 bg-card border-r border-border`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center">
            <BackButton to="/" className="mr-2" />
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1E6FD9] rounded-full flex items-center justify-center">
                <Bike className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading text-lg font-bold">Habal Hub</span>
            </Link>
          </div>
          
          <Separator />
          
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setProfileDialogOpen(true)}
                className="relative cursor-pointer group"
              >
                <Avatar>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </button>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors
                  ${isActive(item.href) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'}
                `}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4">
            <Separator className="mb-4" />
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border py-4 px-6">
          <div className="flex items-center justify-between">
            {isMobile && (
              <div className="flex items-center space-x-3">
                <BackButton />
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#1E6FD9] rounded-full flex items-center justify-center">
                    <Bike className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-heading text-lg font-bold">Habal Hub</span>
                </Link>
              </div>
            )}
            
            <div className="flex items-center space-x-3 ml-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              
              {isMobile && (
                <button 
                  onClick={() => setProfileDialogOpen(true)}
                  className="relative cursor-pointer group"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </header>
        
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="bg-card border-b border-border py-2 px-4 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs whitespace-nowrap
                    ${isActive(item.href) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground bg-secondary'}
                  `}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <ProfilePictureUpload 
              currentAvatar={user.avatar} 
              name={user.name} 
              onUpload={handleProfilePictureUpload}
              size="lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
