
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRevenuePermissions = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user has revenue viewing permission
  const { data: hasRevenuePermission, isLoading: permissionLoading } = useQuery({
    queryKey: ['revenuePermission', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase.rpc('has_admin_permission', {
        user_id: user.id,
        permission: 'view_revenue'
      });

      if (error) {
        console.error('Error checking revenue permission:', error);
        return false;
      }

      return data || false;
    },
    enabled: !!user?.id,
  });

  // Grant revenue permission
  const grantRevenueMutation = useMutation({
    mutationFn: async (targetAdminId: string) => {
      const { data, error } = await supabase.rpc('grant_revenue_permission', {
        target_admin_id: targetAdminId,
        granted_by_admin_id: user?.id
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to grant revenue permission');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Permission granted",
        description: "Revenue viewing permission has been granted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to grant revenue permission",
        variant: "destructive",
      });
    },
  });

  // Revoke revenue permission
  const revokeRevenueMutation = useMutation({
    mutationFn: async (targetAdminId: string) => {
      const { data, error } = await supabase.rpc('revoke_revenue_permission', {
        target_admin_id: targetAdminId,
        revoked_by_admin_id: user?.id
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to revoke revenue permission');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Permission revoked",
        description: "Revenue viewing permission has been revoked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke revenue permission",
        variant: "destructive",
      });
    },
  });

  return {
    hasRevenuePermission: hasRevenuePermission || false,
    permissionLoading,
    grantRevenueMutation,
    revokeRevenueMutation,
    isPrimaryAdmin: profile?.role === 'primary_admin'
  };
};
