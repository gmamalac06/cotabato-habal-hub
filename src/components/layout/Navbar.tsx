
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MotorcycleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-40">
      <div className="habal-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <MotorcycleIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold">Habal Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Home
              </Link>
              <Link to="/about" className={`text-sm font-medium ${location.pathname === '/about' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                About
              </Link>
              <Link to="/contact" className={`text-sm font-medium ${location.pathname === '/contact' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Contact
              </Link>
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/${user.role}`}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`px-2 py-1 rounded-md ${location.pathname === '/' ? 'bg-secondary font-medium' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-2 py-1 rounded-md ${location.pathname === '/about' ? 'bg-secondary font-medium' : ''}`}
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`px-2 py-1 rounded-md ${location.pathname === '/contact' ? 'bg-secondary font-medium' : ''}`}
                onClick={closeMenu}
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center space-x-3 px-2">
                      <Avatar className="h-9 w-9">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-1">
                      <Link 
                        to={`/${user.role}`} 
                        className="block px-2 py-1.5 text-sm rounded-md hover:bg-secondary"
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-2 py-1.5 text-sm rounded-md hover:bg-secondary"
                        onClick={closeMenu}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="block w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-secondary"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-border pt-4 flex flex-col space-y-2">
                  <Button variant="outline" asChild>
                    <Link to="/login" onClick={closeMenu}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={closeMenu}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
