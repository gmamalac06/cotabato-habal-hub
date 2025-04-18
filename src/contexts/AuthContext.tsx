import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("AuthContext - Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthContext - Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("AuthContext - Profile fetch error on auth change:", profileError);
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            console.log("AuthContext - Profile fetch on auth change:", profile ? "Profile found" : "No profile");
            
            if (profile) {
              const userData = {
                id: session.user.id,
                name: profile.full_name || session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
                phone: profile.phone_number || '',
                role: profile.role as UserRole,
                avatar: profile.avatar_url || null
              };
              
              console.log("AuthContext - Setting user on auth change:", userData);
              setUser(userData);
              setIsLoading(false);
            } else {
              setUser(null);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("AuthContext - Error during auth state change:", error);
            setUser(null);
            setIsLoading(false);
          }
        } else {
          console.log("AuthContext - No session or signed out");
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      console.log("AuthContext - Initializing auth state");
      setIsLoading(true);
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthContext - Session error:", sessionError);
          setIsLoading(false);
          return;
        }
        
        console.log("AuthContext - Session check:", session ? "Session exists" : "No session");
        
        if (!session) {
          console.log("AuthContext - No session exists, setting isLoading to false");
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("AuthContext - Profile fetch error:", profileError);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          console.log("AuthContext - Profile fetch:", profile ? "Profile found" : "No profile");
          
          if (profile) {
            const userData = {
              id: session.user.id,
              name: profile.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              phone: profile.phone_number || '',
              role: profile.role as UserRole,
              avatar: profile.avatar_url || null
            };
            
            console.log("AuthContext - Setting user:", userData);
            setUser(userData);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("AuthContext - Initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log("AuthContext - Initialization complete, setting isLoading to false");
      }
    };

    initializeAuth();

    return () => {
      console.log("AuthContext - Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login function called with email:", email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error from Supabase:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        throw error;
      }

      console.log("Login successful with data:", data ? "Data exists" : "No data");

      // Navigation will happen through the auth state change listener
      // We don't need to manually navigate or set the user here
    } catch (error: any) {
      console.error("Login function caught error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ) => {
    console.log("Register function called with email:", email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone_number: phone,
            role: role,
          },
        },
      });

      if (error) {
        console.error("Register error from Supabase:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        throw error;
      }

      console.log("Registration successful with data:", data ? "Data exists" : "No data");

      toast({
        title: "Registration successful",
        description: "You can now log in with your new account.",
      });
      
      // We'll keep the loading state active until the user is redirected to login
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 500);
    } catch (error: any) {
      console.error("Register function caught error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    console.log("Logout function called");
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updatedUser: User) => {
    console.log("UpdateUserProfile function called");
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.name,
          phone_number: updatedUser.phone,
        })
        .eq('id', updatedUser.id);
      
      if (error) {
        console.error("UpdateUserProfile error:", error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("UpdateUserProfile caught error:", error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
