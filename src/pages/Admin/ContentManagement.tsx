
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  content: string;
  created_at: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [newItem, setNewItem] = useState({
    page: '',
    section: '',
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
      setNewItem({ page: '', section: '', content: '' });
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

  // Predefined sections for About and Facilities pages
  const pageSections = {
    about: [
      'hero_description',
      'main_introduction',
      'story_paragraph_1',
      'story_paragraph_2', 
      'story_paragraph_3',
      'luxury_description',
      'location_description',
      'dining_description',
      'service_description'
    ],
    facilities: [
      'hero_description',
      'introduction_text',
      'restaurant_description',
      'executive_rooms_description',
      'power_supply_description',
      'fitness_center_description',
      'outdoor_recreation_description',
      'cta_description'
    ]
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
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-600 mt-2">Manage content for About and Facilities pages</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content Section
          </Button>
        </div>

        {/* Add New Content Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Content Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-page">Page</Label>
                  <Select
                    value={newItem.page}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, page: value, section: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-section">Section</Label>
                  <Select
                    value={newItem.section}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, section: value }))}
                    disabled={!newItem.page}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {newItem.page && pageSections[newItem.page as keyof typeof pageSections]?.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="new-content">Content</Label>
                <Textarea
                  id="new-content"
                  value={newItem.content}
                  onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the content text..."
                  rows={8}
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

        {/* Content List organized by page */}
        <div className="space-y-8">
          {['about', 'facilities'].map((page) => {
            const pageContent = content?.filter(item => item.page === page) || [];
            
            return (
              <div key={page}>
                <h2 className="text-2xl font-semibold mb-4 capitalize">{page} Page Content</h2>
                <div className="grid gap-4">
                  {pageContent.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {item.section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                              {page} page section
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
                                    <SelectItem value="about">About</SelectItem>
                                    <SelectItem value="facilities">Facilities</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Section</Label>
                                <Select
                                  value={editingItem.section}
                                  onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, section: value } : null)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {editingItem.page && pageSections[editingItem.page as keyof typeof pageSections]?.map((section) => (
                                      <SelectItem key={section} value={section}>
                                        {section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Content</Label>
                              <Textarea
                                value={editingItem.content}
                                onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
                                rows={8}
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
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {item.content.length > 300 
                              ? `${item.content.substring(0, 300)}...` 
                              : item.content
                            }
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {pageContent.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500">No content sections found for the {page} page.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
