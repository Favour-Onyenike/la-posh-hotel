
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface EventFormProps {
  editingEvent: Event | null;
  onSubmit: (formData: any, selectedImage: File | null) => void;
  onCancel: () => void;
  isLoading: boolean;
  isUploading: boolean;
}

const EventForm = ({ editingEvent, onSubmit, onCancel, isLoading, isUploading }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: editingEvent?.title || "",
    description: editingEvent?.description || "",
    event_date: editingEvent?.event_date ? new Date(editingEvent.event_date).toISOString().slice(0, 16) : "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editingEvent?.image_url || null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(editingEvent?.image_url || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedImage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingEvent ? "Edit Event" : "Create New Event"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Enter event description"
            />
          </div>
          
          <div>
            <Label htmlFor="event_date">Event Date & Time *</Label>
            <Input
              id="event_date"
              type="datetime-local"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">Event Image</Label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload an image for the event</p>
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading || isUploading}
            >
              {isUploading ? "Uploading..." : editingEvent ? "Update Event" : "Create Event"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
