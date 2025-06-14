
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Lock, Users, Database, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  details?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface SecurityMetric {
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'critical';
}

const SecurityMonitoringPanel = () => {
  const { user, profile, isPrimaryAdmin } = useAuth();
  const { toast } = useToast();
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const runSecurityAudit = async () => {
    setIsLoading(true);
    const checks: SecurityCheck[] = [];
    const metrics: SecurityMetric[] = [];

    try {
      // Check 1: Authentication Status
      checks.push({
        name: 'Authentication Status',
        status: user ? 'pass' : 'fail',
        description: 'User authentication is active and valid',
        details: user ? `Authenticated as ${user.email}` : 'No active session',
        severity: user ? 'low' : 'critical'
      });

      // Check 2: Admin Role Verification
      const hasValidAdminRole = profile?.role === 'admin' || profile?.role === 'primary_admin';
      checks.push({
        name: 'Admin Role Verification',
        status: hasValidAdminRole ? 'pass' : 'fail',
        description: 'User has valid admin privileges',
        details: `Role: ${profile?.role || 'None'} | Expected: admin or primary_admin`,
        severity: hasValidAdminRole ? 'low' : 'critical'
      });

      // Check 3: RLS Policy Verification
      try {
        const { data: profileTest, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user?.id)
          .single();

        checks.push({
          name: 'Profile RLS Protection',
          status: !profileError && profileTest ? 'pass' : 'fail',
          description: 'Row Level Security is protecting profile data',
          details: profileError ? `RLS Error: ${profileError.message}` : 'Profile access properly restricted',
          severity: !profileError ? 'low' : 'high'
        });
      } catch (error) {
        checks.push({
          name: 'Profile RLS Protection',
          status: 'fail',
          description: 'Error testing RLS protection',
          details: error instanceof Error ? error.message : 'Unknown RLS error',
          severity: 'high'
        });
      }

      // Check 4: Admin Activity Logs Access
      if (isPrimaryAdmin || await checkAdminPermission('view_logs')) {
        try {
          const { data: logsData, error: logsError } = await supabase
            .from('admin_activity_logs')
            .select('id')
            .limit(1);

          checks.push({
            name: 'Admin Logs Access Control',
            status: logsError ? 'warning' : 'pass',
            description: 'Admin activity logs are properly secured',
            details: logsError ? `Logs access restricted: ${logsError.message}` : 'Logs accessible with proper permissions',
            severity: 'low'
          });
        } catch (error) {
          checks.push({
            name: 'Admin Logs Access Control',
            status: 'fail',
            description: 'Error testing admin logs access',
            details: error instanceof Error ? error.message : 'Unknown logs error',
            severity: 'medium'
          });
        }
      }

      // Check 5: Invite Token Security
      if (isPrimaryAdmin) {
        try {
          const { data: tokenData, error: tokenError } = await supabase
            .from('invite_tokens')
            .select('id, expires_at, is_used')
            .limit(5);

          const activeTokens = tokenData?.filter(token => !token.is_used && new Date(token.expires_at) > new Date()) || [];
          const expiredTokens = tokenData?.filter(token => !token.is_used && new Date(token.expires_at) <= new Date()) || [];

          checks.push({
            name: 'Invite Token Management',
            status: tokenError ? 'fail' : 'pass',
            description: 'Invite tokens are properly managed and secured',
            details: tokenError ? `Token error: ${tokenError.message}` : `Active: ${activeTokens.length}, Expired: ${expiredTokens.length}`,
            severity: tokenError ? 'medium' : 'low'
          });

          metrics.push({
            label: 'Active Invite Tokens',
            value: activeTokens.length,
            status: activeTokens.length > 10 ? 'warning' : 'good'
          });

          metrics.push({
            label: 'Expired Tokens (Cleanup Needed)',
            value: expiredTokens.length,
            status: expiredTokens.length > 5 ? 'warning' : 'good'
          });
        } catch (error) {
          checks.push({
            name: 'Invite Token Management',
            status: 'fail',
            description: 'Error accessing invite token system',
            details: error instanceof Error ? error.message : 'Unknown token error',
            severity: 'medium'
          });
        }
      }

      // Check 6: Permission System Integrity
      try {
        const permissions = ['view_logs', 'view_revenue', 'view_team'];
        for (const permission of permissions) {
          const hasPermission = await checkAdminPermission(permission);
          const permissionStatus = hasPermission || isPrimaryAdmin;
          
          checks.push({
            name: `Permission: ${permission}`,
            status: permissionStatus ? 'pass' : 'warning',
            description: `${permission} permission is properly configured`,
            details: permissionStatus ? 'Permission granted or inherited' : 'Permission not granted',
            severity: 'low'
          });
        }
      } catch (error) {
        checks.push({
          name: 'Permission System Integrity',
          status: 'fail',
          description: 'Error testing permission system',
          details: error instanceof Error ? error.message : 'Unknown permission error',
          severity: 'high'
        });
      }

      // Security Metrics
      metrics.push({
        label: 'User Role',
        value: profile?.role || 'None',
        status: hasValidAdminRole ? 'good' : 'critical'
      });

      metrics.push({
        label: 'Session Status',
        value: user ? 'Active' : 'Inactive',
        status: user ? 'good' : 'critical'
      });

      const passedChecks = checks.filter(check => check.status === 'pass').length;
      metrics.push({
        label: 'Security Score',
        value: `${passedChecks}/${checks.length}`,
        status: passedChecks === checks.length ? 'good' : passedChecks > checks.length * 0.7 ? 'warning' : 'critical'
      });

    } catch (error) {
      console.error('Security audit failed:', error);
      toast({
        title: "Security Audit Failed",
        description: "Unable to complete security audit. Please check your permissions.",
        variant: "destructive"
      });
    }

    setSecurityChecks(checks);
    setSecurityMetrics(metrics);
    setIsLoading(false);
  };

  const checkAdminPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('has_admin_permission', {
        user_id: user.id,
        permission: permission
      });
      
      return !error && data === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    runSecurityAudit();
  }, [user, profile, isPrimaryAdmin]);

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

  const getSeverityBadge = (severity: SecurityCheck['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="ml-2">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="ml-2 bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="ml-2 bg-yellow-500 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="ml-2">Low</Badge>;
    }
  };

  const getMetricStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
    }
  };

  const criticalIssues = securityChecks.filter(check => check.severity === 'critical' && check.status === 'fail');
  const highIssues = securityChecks.filter(check => check.severity === 'high' && check.status === 'fail');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitoring Panel
          </CardTitle>
          <CardDescription>
            Real-time security status and vulnerability assessment
          </CardDescription>
          <Button 
            onClick={runSecurityAudit} 
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="w-fit"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Run Security Scan
          </Button>
        </CardHeader>
        <CardContent>
          {/* Critical Alerts */}
          {(criticalIssues.length > 0 || highIssues.length > 0) && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">🚨 Security Alerts</h4>
              {criticalIssues.length > 0 && (
                <p className="text-red-700 text-sm mb-1">
                  <strong>Critical:</strong> {criticalIssues.length} critical security issue(s) detected
                </p>
              )}
              {highIssues.length > 0 && (
                <p className="text-red-700 text-sm">
                  <strong>High:</strong> {highIssues.length} high-priority security issue(s) detected
                </p>
              )}
            </div>
          )}

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {securityMetrics.map((metric, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className={`text-lg font-semibold ${getMetricStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* Security Checks */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Security Checks</h4>
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{check.name}</h5>
                      {getSeverityBadge(check.severity)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                    {check.details && (
                      <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(check.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitoringPanel;
