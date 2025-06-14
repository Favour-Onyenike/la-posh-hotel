import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isPrimaryAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Fetching profile for user ${userId} (attempt ${retryCount + 1})`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and this is the first attempt, wait and retry
        if (error.code === 'PGRST116' && retryCount < 2) {
          console.log('Profile not found, retrying in 1 second...');
          setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
          return;
        }
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('Refreshing profile for user:', user.id);
      await fetchProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signIn({ email, password });
      if (error) {
        console.error('Error signing in:', error);
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return;
      }
      setSession(data.session);
      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in signIn:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Error signing up:', error);
        toast({
          title: "Sign up failed",
          description: "Email already in use",
          variant: "destructive"
        });
        return;
      }
      setSession(data.session);
      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in signUp:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Error in signOut:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is admin based on their profile role
  const isAdmin = useMemo(() => {
    return profile?.role === 'admin' || profile?.role === 'primary_admin';
  }, [profile?.role]);

  const isPrimaryAdmin = useMemo(() => {
    return profile?.role === 'primary_admin';
  }, [profile?.role]);

  console.log('AuthContext state:', {
    user: user?.email,
    profile: profile,
    isAdmin: isAdmin,
    isPrimaryAdmin: isPrimaryAdmin,
    isLoading: isLoading
  });

  const value = {
    user,
    profile,
    isLoading,
    isAdmin,
    isPrimaryAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
