
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

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthContext - Initializing auth state");
      setIsLoading(true);
      
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthContext - Session error:", sessionError);
          throw sessionError;
        }
        
        console.log("AuthContext - Session check:", session ? "Session exists" : "No session");
        
        if (session?.user) {
          // Get user profile from the profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("AuthContext - Profile fetch error:", profileError);
            // Continue without throwing, as user might not have a profile yet
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
          }
        }
      } catch (error) {
        console.error("AuthContext - Initialization error:", error);
      } finally {
        setIsLoading(false);
        console.log("AuthContext - Initialization complete");
      }
    };

    // Set up auth state listener
    console.log("AuthContext - Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthContext - Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (event === 'SIGNED_IN' && session) {
          try {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("AuthContext - Profile fetch error on auth change:", profileError);
              // Continue without throwing, as user might not have a profile yet
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
            }
          } catch (error) {
            console.error("AuthContext - Error during auth state change:", error);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("AuthContext - User signed out");
          setUser(null);
        }
      }
    );

    initializeAuth();

    return () => {
      console.log("AuthContext - Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          navigate(`/${profile.role}`);
        }
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
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
        throw new Error(error.message);
      }

      if (data.user) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your new account.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const updateUserProfile = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.name,
          phone_number: updatedUser.phone,
        })
        .eq('id', updatedUser.id);
      
      if (error) {
        throw new Error(error.message);
      }

      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
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
