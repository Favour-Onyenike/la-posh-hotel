
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import EventForm from "@/components/Admin/Events/EventForm";
import EventsList from "@/components/Admin/Events/EventsList";
import { useEventMutations } from "@/hooks/useEventMutations";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const AdminEvents = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const { createEventMutation, updateEventMutation, deleteEventMutation } = useEventMutations();

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const resetForm = () => {
    setIsCreating(false);
    setEditingEvent(null);
  };

  const handleSubmit = (formData: any, selectedImage: File | null) => {
    if (!formData.title || !formData.event_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingEvent) {
      updateEventMutation.mutate({ 
        id: editingEvent.id, 
        eventData: formData,
        selectedImage,
        currentImageUrl: editingEvent.image_url
      }, {
        onSuccess: resetForm
      });
    } else {
      createEventMutation.mutate({ 
        eventData: formData,
        selectedImage
      }, {
        onSuccess: resetForm
      });
    }
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    deleteEventMutation.mutate(id);
  };

  const isFormLoading = createEventMutation.isPending || updateEventMutation.isPending;
  const isUploading = isFormLoading; // Since upload is part of the mutation

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Events Management</h2>
            <p className="text-muted-foreground">Manage hotel events and activities</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={16} className="mr-2" />
            Add Event
          </Button>
        </div>

        {(isCreating || editingEvent) && (
          <EventForm
            editingEvent={editingEvent}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isLoading={isFormLoading}
            isUploading={isUploading}
          />
        )}

        <EventsList
          events={events}
          isLoading={isLoading}
          onEdit={startEdit}
          onDelete={handleDelete}
          isDeleting={deleteEventMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
