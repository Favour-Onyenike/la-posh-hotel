
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Plus, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImagePath } from '@/utils/imageUtils';

const InviteManagement = () => {
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to get correct base URL for GitHub Pages
  const getBaseUrl = () => {
    const isGitHubPages = window.location.pathname.startsWith("/la-posh-hotel");
    const isProduction = import.meta.env.PROD;
    
    if (isGitHubPages || isProduction) {
      return `${window.location.origin}/la-posh-hotel`;
    }
    return window.location.origin;
  };

  // Fetch existing invite tokens
  const { data: inviteTokens = [] } = useQuery({
    queryKey: ['invite-tokens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invite_tokens')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Generate new invite token
  const generateInviteMutation = useMutation({
    mutationFn: async () => {
      const token = crypto.randomUUID();
      const { data, error } = await supabase
        .from('invite_tokens')
        .insert({
          token,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const baseUrl = getBaseUrl();
      const inviteUrl = `${baseUrl}/#/admin/register?token=${data.token}`;
      setGeneratedLink(inviteUrl);
      queryClient.invalidateQueries({ queryKey: ['invite-tokens'] });
      toast({
        title: "Invite link generated",
        description: "Share this link with team members to create admin accounts",
      });
    },
    onError: (error) => {
      console.error('Error generating invite:', error);
      toast({
        title: "Error generating invite",
        description: "Failed to create invite link",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Invite link has been copied to your clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const generateInviteLink = (token: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/#/admin/register?token=${token}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Invite Management
          </CardTitle>
          <CardDescription>
            Generate invite links for team members to create admin accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => generateInviteMutation.mutate()}
            disabled={generateInviteMutation.isPending}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate New Invite Link
          </Button>

          {generatedLink && (
            <div className="space-y-2">
              <Label htmlFor="invite-link">Generated Invite Link</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-link"
                  value={generatedLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedLink)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This link expires in 7 days and can only be used once.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite History</CardTitle>
          <CardDescription>
            View all generated invite links and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inviteTokens.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No invite links generated yet
            </p>
          ) : (
            <div className="space-y-3">
              {inviteTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {token.token.substring(0, 8)}...
                      </code>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          token.is_used
                            ? 'bg-green-100 text-green-800'
                            : isExpired(token.expires_at)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {token.is_used
                          ? 'Used'
                          : isExpired(token.expires_at)
                          ? 'Expired'
                          : 'Active'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(token.created_at)} • 
                      Expires: {formatDate(token.expires_at)}
                    </p>
                  </div>
                  {!token.is_used && !isExpired(token.expires_at) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const inviteUrl = generateInviteLink(token.token);
                        copyToClipboard(inviteUrl);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteManagement;
