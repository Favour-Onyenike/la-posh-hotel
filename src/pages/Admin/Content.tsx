
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/types/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Content = () => {
  const [aboutContent, setAboutContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page', 'about')
        .order('section', { ascending: true });

      if (error) {
        throw error;
      }

      setAboutContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch page content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (item: ContentItem) => {
    setEditItem(item);
    setTitle(item.title || '');
    setContent(item.content);
    setIsEditDialogOpen(true);
  };

  const handleSaveContent = async () => {
    if (!editItem || !content) {
      toast({
        title: 'Missing fields',
        description: 'Please provide content for this section',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('content')
        .update({
          title: title || null,
          content,
        })
        .eq('id', editItem.id);

      if (error) {
        throw error;
      }

      // Update local state
      setAboutContent((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, title, content } : item
        )
      );

      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">Edit website content.</p>
        </div>

        <Tabs defaultValue="about">
          <TabsList className="mb-4">
            <TabsTrigger value="about">About Page</TabsTrigger>
            {/* Add more tabs here for other pages as needed */}
          </TabsList>
          
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
                <CardDescription>
                  Edit the content sections displayed on the About page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {aboutContent.length === 0 ? (
                      <div className="rounded-md border border-dashed p-8 text-center">
                        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No content found</h3>
                        <p className="text-sm text-muted-foreground">
                          Add content sections to your about page.
                        </p>
                      </div>
                    ) : (
                      aboutContent.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-l-4 border-l-primary">
                          <CardHeader className="bg-muted/30 pb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                  Section: {item.section}
                                </p>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                                Edit
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="prose max-w-none text-muted-foreground">
                              <p className="whitespace-pre-line">{item.content}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit {editItem?.section} Section</DialogTitle>
            <DialogDescription>
              Update the content for this section of the about page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Section title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-right">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                className="min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContent} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Content;
