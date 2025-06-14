
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  title: string;
  description: string;
  event_date: string;
}

export const useEventMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    console.log('Uploading file:', filePath);

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);

    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;
  };

  const createEventMutation = useMutation({
    mutationFn: async ({ eventData, selectedImage }: { eventData: FormData; selectedImage: File | null }) => {
      let imageUrl = "";
      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const { data, error } = await supabase
        .from("events")
        .insert([{ 
          title: eventData.title,
          description: eventData.description || null,
          event_date: eventData.event_date,
          image_url: imageUrl || null
        }])
        .select();
      
      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Failed to create event: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Success", description: "Event created successfully!" });
    },
    onError: (error: Error) => {
      console.error('Create event error:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create event", 
        variant: "destructive" 
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, eventData, selectedImage, currentImageUrl }: { 
      id: string; 
      eventData: FormData; 
      selectedImage: File | null;
      currentImageUrl: string | null;
    }) => {
      let imageUrl = currentImageUrl;
      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const { data, error } = await supabase
        .from("events")
        .update({ 
          title: eventData.title,
          description: eventData.description || null,
          event_date: eventData.event_date,
          image_url: imageUrl || null
        })
        .eq("id", id)
        .select();
      
      if (error) {
        console.error('Database update error:', error);
        throw new Error(`Failed to update event: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Success", description: "Event updated successfully!" });
    },
    onError: (error: Error) => {
      console.error('Update event error:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update event", 
        variant: "destructive" 
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Success", description: "Event deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete event", 
        variant: "destructive" 
      });
    },
  });

  return {
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
  };
};
