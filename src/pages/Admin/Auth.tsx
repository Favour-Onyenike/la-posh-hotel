
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home, Shield, User, Key, LogIn, AlertCircle, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the login form schema
const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Define the signup form schema with additional validation
const signupFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  fullName: z.string().min(1, "Full name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type SignupFormValues = z.infer<typeof signupFormSchema>;

const Auth = () => {
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, isLoading, user, profile, updateUserRole, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: 'manager@laposh.com',
      password: 'abcd1234',
    },
  });

  // Initialize signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
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

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setAuthError(null);
      console.log('Submitting login form');
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error('Login error:', error.message);
        setAuthError(error.message);
        return;
      }
      
      console.log('Login successful, waiting for auth state to update');
      toast({
        title: "Logging in",
        description: "Authenticating your credentials...",
      });
      // The useEffect above will handle redirect when auth state updates
    } catch (error: any) {
      console.error('Login form submission error:', error);
      setAuthError(error?.message || 'An unknown error occurred');
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    try {
      setAuthError(null);
      console.log('Submitting signup form');
      
      // Call the signUp function from AuthContext
      const { error } = await signUp(values.email, values.password, values.fullName);
      
      if (error) {
        console.error('Signup error:', error.message);
        setAuthError(error.message);
        return;
      }
      
      toast({
        title: "Account created",
        description: "Please log in with your new credentials",
      });
      
      // Switch back to login form
      setIsSigningUp(false);
    } catch (error: any) {
      console.error('Signup form submission error:', error);
      setAuthError(error?.message || 'An unknown error occurred');
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
                <CardTitle className="text-3xl font-bold text-white">
                  {isSigningUp ? "Create Admin Account" : "Admin Login"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isSigningUp 
                    ? "Create a new account to access the admin panel" 
                    : "Enter your credentials to access the admin panel"
                  }
                </CardDescription>
              </CardHeader>

              {authError && (
                <div className="mx-6 mb-2 rounded-md bg-red-900/30 p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-300">Authentication Error</h3>
                      <div className="mt-1 text-sm text-red-200">
                        <p>{authError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isSigningUp ? (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Full Name</FormLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
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
                        control={signupForm.control}
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
                        control={signupForm.control}
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
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                            <div className="relative">
                              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confirm your password"
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
                        disabled={signupForm.formState.isSubmitting}
                      >
                        {signupForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsSigningUp(false)}
                      >
                        Already have an account? Log in
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
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={loginForm.control}
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
                        control={loginForm.control}
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
                        disabled={loginForm.formState.isSubmitting}
                      >
                        {loginForm.formState.isSubmitting ? (
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
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsSigningUp(true)}
                      >
                        Don't have an account? Sign up
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
              )}
            </Card>
          )}
          <p className="mt-4 text-center text-sm text-gray-400">
            Default admin credentials: "manager@laposh.com" with password "abcd1234"
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
