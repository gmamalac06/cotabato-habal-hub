
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { findUserByEmail } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, phone: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("habalUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials with a backend API
      // For this mock version, we'll just check if the user exists
      const user = findUserByEmail(email);
      
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Password check would happen on the server in a real app
      // Here we're just simulating success if the user exists
      
      setUser(user);
      localStorage.setItem("habalUser", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("habalUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const register = async (email: string, password: string, name: string, phone: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, you would send this data to your backend API
      // and create a new user in your database
      // For this mock version, we'll just simulate success
      
      const newUser: User = {
        id: `new-${Date.now().toString(36)}`,
        email,
        name,
        phone,
        role,
        createdAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem("habalUser", JSON.stringify(newUser));
      toast({
        title: "Registration successful",
        description: `Welcome to Habal Hub, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
