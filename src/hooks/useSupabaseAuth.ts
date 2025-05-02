
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { fetchUserProfile } from '@/utils/authUtils';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("useSupabaseAuth - Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useSupabaseAuth - Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (session?.user) {
          try {
            const { profile, error: profileError } = await fetchUserProfile(session.user.id);
            
            if (profileError) {
              console.error("useSupabaseAuth - Profile fetch error on auth change:", profileError);
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            console.log("useSupabaseAuth - Profile fetch on auth change:", profile ? "Profile found" : "No profile");
            
            if (profile) {
              const userData = {
                id: session.user.id,
                name: profile.full_name || session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
                phone: profile.phone_number || '',
                role: profile.role as UserRole,
                avatar: profile.avatar_url || null
              };
              
              console.log("useSupabaseAuth - Setting user on auth change:", userData);
              setUser(userData);
              setIsLoading(false);
            } else {
              setUser(null);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("useSupabaseAuth - Error during auth state change:", error);
            setUser(null);
            setIsLoading(false);
          }
        } else {
          console.log("useSupabaseAuth - No session or signed out");
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      console.log("useSupabaseAuth - Initializing auth state");
      setIsLoading(true);
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("useSupabaseAuth - Session error:", sessionError);
          setIsLoading(false);
          return;
        }
        
        console.log("useSupabaseAuth - Session check:", session ? "Session exists" : "No session");
        
        if (!session) {
          console.log("useSupabaseAuth - No session exists, setting isLoading to false");
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          const { profile, error: profileError } = await fetchUserProfile(session.user.id);
          
          if (profileError) {
            console.error("useSupabaseAuth - Profile fetch error:", profileError);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          console.log("useSupabaseAuth - Profile fetch:", profile ? "Profile found" : "No profile");
          
          if (profile) {
            const userData = {
              id: session.user.id,
              name: profile.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              phone: profile.phone_number || '',
              role: profile.role as UserRole,
              avatar: profile.avatar_url || null
            };
            
            console.log("useSupabaseAuth - Setting user:", userData);
            setUser(userData);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("useSupabaseAuth - Initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log("useSupabaseAuth - Initialization complete, setting isLoading to false");
      }
    };

    initializeAuth();

    return () => {
      console.log("useSupabaseAuth - Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading
  };
};
