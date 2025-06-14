
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  details?: string;
}

const SecurityAuditComponent = () => {
  const { user, profile } = useAuth();
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const runSecurityAudit = async () => {
    setIsLoading(true);
    const checks: SecurityCheck[] = [];

    // Check 1: User Authentication
    checks.push({
      name: 'User Authentication',
      status: user ? 'pass' : 'fail',
      description: 'User is properly authenticated',
      details: user ? `Authenticated as ${user.email}` : 'No user session found'
    });

    // Check 2: Admin Role Verification
    const isAdmin = profile?.role === 'admin' || profile?.role === 'primary_admin';
    checks.push({
      name: 'Admin Role Verification',
      status: isAdmin ? 'pass' : 'fail',
      description: 'User has proper admin privileges',
      details: `Current role: ${profile?.role || 'No role'}`
    });

    // Check 3: RLS Policy Test - Try to access admin activity logs
    try {
      const { data: logsData, error: logsError } = await supabase
        .from('admin_activity_logs')
        .select('id')
        .limit(1);

      checks.push({
        name: 'Admin Activity Logs Access',
        status: logsError ? 'fail' : 'pass',
        description: 'Access to admin activity logs is properly controlled',
        details: logsError ? `Error: ${logsError.message}` : 'Access granted successfully'
      });
    } catch (error) {
      checks.push({
        name: 'Admin Activity Logs Access',
        status: 'fail',
        description: 'Error testing admin activity logs access',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check 4: Profile Data Access
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user?.id)
        .single();

      checks.push({
        name: 'Profile Data Access',
        status: profileError ? 'fail' : 'pass',
        description: 'User can access their own profile data',
        details: profileError ? `Error: ${profileError.message}` : 'Profile data accessible'
      });
    } catch (error) {
      checks.push({
        name: 'Profile Data Access',
        status: 'fail',
        description: 'Error accessing profile data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check 5: Permissions System
    if (user) {
      try {
        const { data: permissionData, error: permissionError } = await supabase
          .rpc('has_admin_permission', {
            user_id: user.id,
            permission: 'view_logs'
          });

        checks.push({
          name: 'Permission System',
          status: permissionError ? 'fail' : 'pass',
          description: 'Admin permission system is functioning',
          details: permissionError ? `Error: ${permissionError.message}` : `Permission check result: ${permissionData}`
        });
      } catch (error) {
        checks.push({
          name: 'Permission System',
          status: 'fail',
          description: 'Error testing permission system',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setSecurityChecks(checks);
    setIsLoading(false);
  };

  useEffect(() => {
    runSecurityAudit();
  }, [user, profile]);

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    }
  };

  const passedChecks = securityChecks.filter(check => check.status === 'pass').length;
  const totalChecks = securityChecks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit
        </CardTitle>
        <CardDescription>
          Current security status: {passedChecks}/{totalChecks} checks passed
        </CardDescription>
        <Button 
          onClick={runSecurityAudit} 
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="w-fit"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Run Security Audit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityChecks.map((check, index) => (
            <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <h4 className="font-medium">{check.name}</h4>
                  <p className="text-sm text-gray-600">{check.description}</p>
                  {check.details && (
                    <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                  )}
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditComponent;
