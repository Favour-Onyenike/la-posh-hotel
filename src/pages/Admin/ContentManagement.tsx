
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  title: string | null;
  content: string;
}

const ContentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState<Record<string, ContentItem>>({});

  // Fetch content data
  const { data: contentData, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .in("page", ["about", "facilities"])
        .order("page", { ascending: true });

      if (error) throw error;
      return data as ContentItem[];
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async (updatedContent: ContentItem) => {
      const { error } = await supabase
        .from("content")
        .update({
          title: updatedContent.title,
          content: updatedContent.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedContent.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
      console.error("Error updating content:", error);
    },
  });

  // Initialize editing content when data loads
  useEffect(() => {
    if (contentData) {
      const contentMap: Record<string, ContentItem> = {};
      contentData.forEach((item) => {
        contentMap[item.id] = { ...item };
      });
      setEditingContent(contentMap);
    }
  }, [contentData]);

  const handleContentChange = (id: string, field: "title" | "content", value: string) => {
    setEditingContent((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (id: string) => {
    const content = editingContent[id];
    if (content) {
      updateContentMutation.mutate(content);
    }
  };

  const renderContentEditor = (item: ContentItem) => {
    const editingItem = editingContent[item.id] || item;
    const hasChanges = 
      editingItem.title !== item.title || editingItem.content !== item.content;

    return (
      <Card key={item.id} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg capitalize">
            {item.section.replace(/_/g, " ")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`title-${item.id}`}>Title</Label>
            <Input
              id={`title-${item.id}`}
              value={editingItem.title || ""}
              onChange={(e) => handleContentChange(item.id, "title", e.target.value)}
              placeholder="Enter title..."
            />
          </div>
          <div>
            <Label htmlFor={`content-${item.id}`}>Content</Label>
            <Textarea
              id={`content-${item.id}`}
              value={editingItem.content}
              onChange={(e) => handleContentChange(item.id, "content", e.target.value)}
              placeholder="Enter content..."
              rows={item.section.includes("content") ? 8 : 3}
            />
          </div>
          <Button
            onClick={() => handleSave(item.id)}
            disabled={!hasChanges || updateContentMutation.isPending}
            className="w-full"
          >
            {updateContentMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const aboutContent = contentData?.filter((item) => item.page === "about") || [];
  const facilitiesContent = contentData?.filter((item) => item.page === "facilities") || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-600 mt-2">
            Edit the content that appears on your About and Facilities pages
          </p>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About Page</TabsTrigger>
            <TabsTrigger value="facilities">Facilities Page</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About Page Content</h2>
              {aboutContent.map(renderContentEditor)}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Facilities Page Content</h2>
              {facilitiesContent.map(renderContentEditor)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
