
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Rider",
    email: "rider@example.com",
    phone: "09123456789",
    role: "rider" as UserRole,
    avatar: null,
  },
  {
    id: "2",
    name: "Dave Driver",
    email: "driver@example.com",
    phone: "09987654321",
    role: "driver" as UserRole,
    avatar: null,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    phone: "09111222333",
    role: "admin" as UserRole,
    avatar: null,
  },
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ 
  children: React.ReactNode; 
  navigate: (path: string) => void;
}> = ({ children, navigate }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("habal_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("habal_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("habal_user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user by email (in a real app, we'd verify password too)
      const foundUser = mockUsers.find((u) => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        navigate(`/${foundUser.role}`);
      } else {
        throw new Error("Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new user (in a real app, we'd check for existing users, validate data, etc.)
      const newUser = {
        id: String(mockUsers.length + 1),
        name,
        email,
        phone,
        role,
        avatar: null,
      };

      // Add to our "database"
      mockUsers.push(newUser);

      // Log in the new user
      setUser(newUser);
      navigate(`/${role}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    
    // In a real app, you would also update this on the server
    const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      updateUserProfile,
      navigate
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
