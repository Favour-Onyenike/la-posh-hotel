
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if this is the first admin user (no existing admin profiles)
      const { data: existingAdmins, error: adminError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (adminError) {
        throw new Error(adminError.message);
      }

      const isFirstAdmin = existingAdmins?.length === 0;
      console.log('Is first admin?', isFirstAdmin, 'Existing admins:', existingAdmins?.length);

      // If not first admin and no invite token, require invite
      if (!isFirstAdmin && !inviteToken) {
        toast({
          title: "Invalid Registration",
          description: "You need a valid invite link to register as an admin",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Validate invite token if provided (and not first admin)
      if (inviteToken && !isFirstAdmin) {
        const { data: tokenData, error: tokenError } = await supabase
          .from('invite_tokens')
          .select('*')
          .eq('token', inviteToken)
          .eq('is_used', false)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (tokenError || !tokenData) {
          toast({
            title: "Invalid Invite",
            description: "This invite link is invalid or has expired",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      const redirectUrl = `${window.location.origin}/admin`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            full_name: fullName,
            invite_token: inviteToken || undefined,
            is_first_admin: isFirstAdmin
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // If user was created successfully, manually create/update the profile
      if (data.user) {
        console.log('User created, updating profile:', { username, fullName, isFirstAdmin });
        
        // Update the profile with the username
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: username,
            full_name: fullName
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('Profile updated successfully');
        }
      }

      toast({
        title: "Registration Successful",
        description: isFirstAdmin 
          ? "Welcome! You've created the first admin account and can now log in." 
          : "Please check your email to confirm your account",
      });
      
      // For first admin or successful registration, redirect to login
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/62098d96-b078-48ab-9a8e-c9421cbf891e.png" 
            alt="La Posh Signature Suites" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>
            {inviteToken ? 'Complete your registration' : 'Set up your admin account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegister;
