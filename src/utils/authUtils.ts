
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

/**
 * Logs in a user with email and password
 */
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  console.log("Login function called with email:", email);
  
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
      return { error };
    }

    console.log("Login successful with data:", data ? "Data exists" : "No data");
    return { data };
  } catch (error: any) {
    console.error("Login function caught error:", error);
    toast({
      title: "Login failed",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};

/**
 * Registers a new user with email, password and profile data
 */
export const registerNewUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
  role: UserRole
) => {
  console.log("Register function called with email:", email);
  
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
        emailRedirectTo: window.location.origin + '/login',
      },
    });

    if (error) {
      console.error("Register error from Supabase:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    console.log("Registration successful with data:", data ? "Data exists" : "No data");

    toast({
      title: "Registration successful",
      description: "Please check your email to verify your account before logging in.",
    });
    
    return { data };
  } catch (error: any) {
    console.error("Register function caught error:", error);
    toast({
      title: "Registration failed",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};

/**
 * Signs out the current user
 */
export const signOutUser = async () => {
  console.log("Logout function called");
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    toast({
      title: "Logout failed",
      description: "Failed to log out. Please try again.",
      variant: "destructive",
    });
    return { error };
  }
};

/**
 * Updates a user's profile in the profiles table
 */
export const updateUserProfileData = async (updatedUser: User) => {
  console.log("UpdateUserProfile function called");
  
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

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("UpdateUserProfile caught error:", error);
    toast({
      title: "Update failed",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};

/**
 * Fetches the user profile from the profiles table
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Profile fetch error:", error);
      return { error };
    }
    
    return { profile };
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return { error };
  }
};
