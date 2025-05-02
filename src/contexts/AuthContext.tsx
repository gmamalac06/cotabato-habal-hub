import React, { createContext, useContext, useState } from "react";
import { User, UserRole } from "@/types";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { 
  loginWithEmailAndPassword, 
  registerNewUser, 
  signOutUser, 
  updateUserProfileData 
} from "@/utils/authUtils";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ) => Promise<{ data?: any; error?: any }>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ 
  children: React.ReactNode; 
  navigate: (path: string) => void;
}> = ({ children, navigate }) => {
  const { user, isLoading } = useSupabaseAuth();
  const [loadingAuth, setLoadingAuth] = useState(false);
  
  const login = async (email: string, password: string) => {
    setLoadingAuth(true);
    const result = await loginWithEmailAndPassword(email, password);
    setLoadingAuth(false);
    return result;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ) => {
    setLoadingAuth(true);
    const result = await registerNewUser(email, password, name, phone, role);
    
    // We'll keep the loading state active until the user is redirected to login
    setTimeout(() => {
      setLoadingAuth(false);
      navigate('/login');
    }, 500);
    
    return result;
  };

  const logout = async () => {
    setLoadingAuth(true);
    await signOutUser();
    setLoadingAuth(false);
    navigate("/login");
  };

  const updateUserProfile = async (updatedUser: User) => {
    setLoadingAuth(true);
    const result = await updateUserProfileData(updatedUser);
    if (result.success) {
      // Set the new user data in state
      // Note: This might be redundant since auth state change should trigger anyway
      // but it provides immediate feedback to the user
    }
    setLoadingAuth(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading: isLoading || loadingAuth, 
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
