
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Info } from 'lucide-react';

interface SecurityInfo {
  name: string;
  status: 'pass' | 'fail' | 'info';
  description: string;
  details?: string;
}

const SecurityAuditComponent = () => {
  const { user, profile } = useAuth();
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const runBasicSecurityCheck = async () => {
    setIsLoading(true);
    const info: SecurityInfo[] = [];

    // Basic authentication check
    info.push({
      name: 'Authentication Status',
      status: user ? 'pass' : 'fail',
      description: 'Current authentication state',
      details: user ? `Logged in as ${user.email}` : 'Not authenticated'
    });

    // Role information
    info.push({
      name: 'User Role',
      status: 'info',
      description: 'Current user role and permissions',
      details: `Role: ${profile?.role || 'No role assigned'}`
    });

    // Profile access test
    if (user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();

        info.push({
          name: 'Profile Access',
          status: profileError ? 'fail' : 'pass',
          description: 'Access to user profile data',
          details: profileError ? `Error: ${profileError.message}` : 'Profile data accessible'
        });
      } catch (error) {
        info.push({
          name: 'Profile Access',
          status: 'fail',
          description: 'Error accessing profile data',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Security note
    info.push({
      name: 'Security Notice',
      status: 'info',
      description: 'Enhanced security measures are active',
      details: 'Row Level Security (RLS) policies protect all data access. Role escalation has been disabled.'
    });

    setSecurityInfo(info);
    setIsLoading(false);
  };

  useEffect(() => {
    runBasicSecurityCheck();
  }, [user, profile]);

  const getStatusIcon = (status: SecurityInfo['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: SecurityInfo['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'fail':
        return <Badge variant="destructive">Issue</Badge>;
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Information
        </CardTitle>
        <CardDescription>
          Basic security status and information
        </CardDescription>
        <Button 
          onClick={runBasicSecurityCheck} 
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="w-fit"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityInfo.map((info, index) => (
            <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                {getStatusIcon(info.status)}
                <div>
                  <h4 className="font-medium">{info.name}</h4>
                  <p className="text-sm text-gray-600">{info.description}</p>
                  {info.details && (
                    <p className="text-xs text-gray-500 mt-1">{info.details}</p>
                  )}
                </div>
              </div>
              {getStatusBadge(info.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditComponent;
