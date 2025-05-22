
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isAdmin, isLoading, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // This effect runs when auth state changes
  useEffect(() => {
    if (user && profile) {
      console.log('Auth.tsx - User logged in:', user.email);
      console.log('Auth.tsx - User profile:', profile);
      console.log('Auth.tsx - Is admin check:', profile.role === 'admin', 'Role:', profile.role);
      
      if (profile.role === 'admin') {
        console.log('Auth.tsx - User is admin, redirecting to dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Auth.tsx - User is not admin, showing error');
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
      }
    }
  }, [user, profile, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting login form');
      const { error } = await signIn(email, password);
      
      if (!error) {
        console.log('Login successful, waiting for auth state to update');
        // The useEffect above will handle redirect when auth state updates
      }
    } catch (error) {
      console.error('Login form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is already logged in and is admin, redirect immediately
  if (user && profile?.role === 'admin') {
    console.log('Auth.tsx - Already logged in as admin, redirecting immediately');
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <Link to="/" className="w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Use "admin@laposh.com" with your password to log in as admin
        </p>
      </div>
    </div>
  );
};

export default Auth;
