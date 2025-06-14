
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useTeamPermissions = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user has team viewing permission
  const { data: hasTeamPermission, isLoading: permissionLoading } = useQuery({
    queryKey: ['teamPermission', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase.rpc('has_admin_permission', {
        user_id: user.id,
        permission: 'view_team'
      });

      if (error) {
        console.error('Error checking team permission:', error);
        return false;
      }

      return data || false;
    },
    enabled: !!user?.id,
  });

  // Grant team permission
  const grantTeamMutation = useMutation({
    mutationFn: async (targetAdminId: string) => {
      const { data, error } = await supabase.rpc('grant_team_permission', {
        target_admin_id: targetAdminId,
        granted_by_admin_id: user?.id
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to grant team permission');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Permission granted",
        description: "Team management permission has been granted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to grant team permission",
        variant: "destructive",
      });
    },
  });

  // Revoke team permission
  const revokeTeamMutation = useMutation({
    mutationFn: async (targetAdminId: string) => {
      const { data, error } = await supabase.rpc('revoke_team_permission', {
        target_admin_id: targetAdminId,
        revoked_by_admin_id: user?.id
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to revoke team permission');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Permission revoked",
        description: "Team management permission has been revoked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke team permission",
        variant: "destructive",
      });
    },
  });

  return {
    hasTeamPermission: hasTeamPermission || false,
    permissionLoading,
    grantTeamMutation,
    revokeTeamMutation,
    isPrimaryAdmin: profile?.role === 'primary_admin'
  };
};
