
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, executeWithRetry } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize from localStorage if available
const getStoredProfile = () => {
  try {
    const storedProfile = localStorage.getItem('creatorhub-profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error("Error parsing stored profile:", error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(getStoredProfile());
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Use executeWithRetry with a function that returns a Promise
      const { data, error } = await executeWithRetry(() => {
        return supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
      });

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
      // Store profile in localStorage for persistence
      localStorage.setItem('creatorhub-profile', JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        // Update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // When session changes, fetch profile
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          // Clear profile when signed out
          setProfile(null);
          localStorage.removeItem('creatorhub-profile');
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await executeWithRetry(() => supabase.auth.getSession());
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await executeWithRetry(() => supabase.auth.signOut());
      if (error) {
        throw error;
      }
      
      // Clear profile and session data from localStorage
      localStorage.removeItem('creatorhub-profile');
      
      // Reset states
      setSession(null);
      setUser(null);
      setProfile(null);
      
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile }}>
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
