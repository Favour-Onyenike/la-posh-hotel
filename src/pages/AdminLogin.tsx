
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let email = identifier;
      
      // Check if identifier is a username (doesn't contain @)
      if (!identifier.includes('@')) {
        // Look up email by username
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        if (profileError || !profile) {
          setError('Username not found');
          return;
        }
        
        email = profile.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/lovable-uploads/b841abff-1a31-4104-9335-b652fe261765.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Link 
        to="/" 
        className="absolute left-6 top-6 flex items-center text-white hover:text-gray-300 transition-colors z-10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/62098d96-b078-48ab-9a8e-c9421cbf891e.png" 
              alt="La Posh Signature Suites" 
              className="h-12 w-auto mx-auto"
            />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your username/email and password to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
