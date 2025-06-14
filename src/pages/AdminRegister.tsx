
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invite token');
      setTokenValid(false);
      return;
    }

    // Verify token validity
    const verifyToken = async () => {
      try {
        const { data, error } = await supabase
          .from('invite_tokens')
          .select('*')
          .eq('token', token)
          .eq('is_used', false)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (error || !data) {
          setError('Invalid, expired, or already used invite token');
          setTokenValid(false);
        } else {
          setTokenValid(true);
        }
      } catch (err) {
        setError('Error verifying invite token');
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenValid) {
      setError('Invalid invite token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            invite_token: token
          },
          emailRedirectTo: `${window.location.origin}/admin/dashboard`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        toast({
          title: "Registration successful",
          description: "Your admin account has been created. Please check your email to verify your account.",
        });
        
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (tokenValid === false) {
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
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Invalid Invite</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                The invite link is invalid, expired, or has already been used.
              </p>
              <Link to="/admin/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        to="/admin/login" 
        className="absolute left-6 top-6 flex items-center text-white hover:text-gray-300 transition-colors z-10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Login
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
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Create Admin Account
          </CardTitle>
          <CardDescription>
            Complete your registration to join the admin team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                minLength={6}
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegister;
