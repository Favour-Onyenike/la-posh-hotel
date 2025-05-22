
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home, Shield, User, Key, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema for validation
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Auth = () => {
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const { signIn, isLoading, user, profile, updateUserRole, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'onyenikefavour8@gmail.com',
      password: 'abcd1234',
    },
  });

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

  const onSubmit = async (values: FormValues) => {
    try {
      console.log('Submitting login form');
      const { error } = await signIn(values.email, values.password);
      
      if (!error) {
        console.log('Login successful, waiting for auth state to update');
        toast({
          title: "Logging in",
          description: "Authenticating your credentials...",
        });
        // The useEffect above will handle redirect when auth state updates
      }
    } catch (error) {
      console.error('Login form submission error:', error);
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) return;
    
    setIsUpdatingRole(true);
    try {
      await updateUserRole(user.id, 'admin');
      // The role update will trigger a profile update which will be caught by the useEffect
    } catch (error) {
      console.error('Error making user admin:', error);
    } finally {
      setIsUpdatingRole(false);
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {user && profile && profile.role !== 'admin' ? (
            <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-md text-white">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold text-white">Admin Access Required</CardTitle>
                <CardDescription className="text-gray-300">
                  Your account doesn't have admin privileges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-amber-900/30 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-300">Access Denied</h3>
                      <div className="mt-2 text-sm text-amber-200">
                        <p>Your account doesn't have the necessary permissions to access the admin area.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleMakeAdmin}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  disabled={isUpdatingRole}
                >
                  {isUpdatingRole ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting admin privileges...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Grant Admin Privileges
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  onClick={() => signOut()} 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Sign Out and Try Another Account
                </Button>
                <Link to="/" className="w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-md text-white">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold text-white">Admin Login</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your credentials to access the admin panel
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-amber-500"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-amber-500"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Logging in...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </Button>
                    <Link to="/" className="w-full">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                      </Button>
                    </Link>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          )}
          <p className="mt-4 text-center text-sm text-gray-400">
            Use "onyenikefavour8@gmail.com" with password "abcd1234" to log in as admin
          </p>
        </div>
      </div>

      {/* Right side - Hotel branding */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center" 
           style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop')"}}
      >
        <div className="w-full flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">La Posh Hotel</h1>
          <p className="text-xl text-gray-300 mb-8">Admin Management System</p>
          <div className="w-20 h-1 bg-amber-500 rounded mb-8"></div>
          <p className="text-gray-300 max-w-lg mx-auto">
            Manage your hotel's bookings, rooms, customers, and more with our intuitive admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
