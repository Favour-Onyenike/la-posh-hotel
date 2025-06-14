
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Edit2, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';

interface ContentItem {
  id: string;
  page: string;
  section: string;
  title?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [newItem, setNewItem] = useState({
    page: '',
    section: '',
    title: '',
    content: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all content
  const { data: content, isLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('page', { ascending: true })
        .order('section', { ascending: true });
      
      if (error) throw error;
      return data as ContentItem[];
    }
  });

  // Create content mutation
  const createContent = useMutation({
    mutationFn: async (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setNewItem({ page: '', section: '', title: '', content: '' });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Content created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive"
      });
    }
  });

  // Update content mutation
  const updateContent = useMutation({
    mutationFn: async (item: ContentItem) => {
      const { data, error } = await supabase
        .from('content')
        .update({
          page: item.page,
          section: item.section,
          title: item.title,
          content: item.content
        })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Content updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  });

  // Delete content mutation
  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Success",
        description: "Content deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  });

  const handleSaveEdit = () => {
    if (editingItem) {
      updateContent.mutate(editingItem);
    }
  };

  const handleCreateNew = () => {
    if (newItem.page && newItem.section && newItem.content) {
      createContent.mutate(newItem);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteContent.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>

        {/* Add New Content Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-page">Page</Label>
                  <Select
                    value={newItem.page}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, page: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-section">Section</Label>
                  <Input
                    id="new-section"
                    value={newItem.section}
                    onChange={(e) => setNewItem(prev => ({ ...prev, section: e.target.value }))}
                    placeholder="Section name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="new-title">Title (Optional)</Label>
                <Input
                  id="new-title"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Content title"
                />
              </div>
              <div>
                <Label htmlFor="new-content">Content</Label>
                <Textarea
                  id="new-content"
                  value={newItem.content}
                  onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Content text"
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateNew}
                  disabled={createContent.isPending || !newItem.page || !newItem.section || !newItem.content}
                >
                  {createContent.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Content
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content List */}
        <div className="grid gap-4">
          {content?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {item.title || `${item.page} - ${item.section}`}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Page: {item.page} | Section: {item.section}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingItem?.id === item.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Page</Label>
                        <Select
                          value={editingItem.page}
                          onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, page: value } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="about">About</SelectItem>
                            <SelectItem value="facilities">Facilities</SelectItem>
                            <SelectItem value="contact">Contact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Section</Label>
                        <Input
                          value={editingItem.section}
                          onChange={(e) => setEditingItem(prev => prev ? { ...prev, section: e.target.value } : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editingItem.title || ''}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={editingItem.content}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
                        rows={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} disabled={updateContent.isPending}>
                        {updateContent.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingItem(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    {item.content.length > 200 
                      ? `${item.content.substring(0, 200)}...` 
                      : item.content
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {content?.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No content found. Create your first content item.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
