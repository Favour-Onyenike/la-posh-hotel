import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Edit, Hotel, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RoomTimelineDialog from '@/components/Admin/RoomTimelineDialog';

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<Room['availability_status']>('available');
  const [imageUrl, setImageUrl] = useState('');
  const [featuresArray, setFeaturesArray] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Timeline dialog state
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [timelineRoom, setTimelineRoom] = useState<Room | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'room')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      // Ensure all rooms have an availability_status property
      const roomsWithDefaultStatus = (data || []).map(room => ({
        ...room,
        availability_status: room.availability_status || 'available' as Room['availability_status']
      }));

      setRooms(roomsWithDefaultStatus as Room[]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRoomNumber = async (roomName: string) => {
    try {
      const { data: existingRooms, error } = await supabase
        .from('rooms')
        .select('room_number')
        .eq('name', roomName)
        .eq('room_type', 'room')
        .order('room_number', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!existingRooms || existingRooms.length === 0) {
        return '01';
      }

      const lastRoomNumber = existingRooms[0].room_number;
      const nextNumber = parseInt(lastRoomNumber) + 1;
      return nextNumber.toString().padStart(2, '0');
    } catch (error) {
      console.error('Error generating room number:', error);
      return '01';
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPricePerNight('');
    setCapacity('');
    setRoomNumber('');
    setAvailabilityStatus('available');
    setImageUrl('');
    setFeaturesArray([]);
    setNewFeature('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeaturesArray([...featuresArray, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeaturesArray(featuresArray.filter((_, i) => i !== index));
  };

  const handleAddRoom = async () => {
    if (!validateForm()) return;

    try {
      setUploading(true);
      let finalImageUrl = imageUrl;
      let finalRoomNumber = roomNumber;

      if (!finalRoomNumber) {
        finalRoomNumber = await generateRoomNumber(name);
      }

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicURL } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        if (!publicURL) {
          throw new Error('Failed to get public URL');
        }

        finalImageUrl = publicURL.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('rooms')
        .insert({
          name,
          description,
          price_per_night: parseFloat(pricePerNight),
          capacity: parseInt(capacity),
          room_type: 'room',
          room_number: finalRoomNumber,
          availability_status: availabilityStatus,
          image_url: finalImageUrl || null,
          features: featuresArray,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Success',
        description: 'Room added successfully',
      });

      fetchRooms();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding room:', error);
      toast({
        title: 'Error',
        description: 'Failed to add room',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditRoom = async () => {
    if (!validateForm() || !selectedRoom) return;

    try {
      setUploading(true);
      let finalImageUrl = imageUrl;
      let finalRoomNumber = roomNumber;

      if (!finalRoomNumber) {
        finalRoomNumber = await generateRoomNumber(name);
      }

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicURL } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        if (!publicURL) {
          throw new Error('Failed to get public URL');
        }

        finalImageUrl = publicURL.publicUrl;
      }

      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          name,
          description,
          price_per_night: parseFloat(pricePerNight),
          capacity: parseInt(capacity),
          room_type: 'room',
          room_number: finalRoomNumber,
          availability_status: availabilityStatus,
          image_url: finalImageUrl || null,
          features: featuresArray,
        })
        .eq('id', selectedRoom.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Room updated successfully',
      });

      fetchRooms();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleQuickStatusUpdate = async (roomId: string, newStatus: Room['availability_status']) => {
    // If changing to 'taken', show timeline dialog
    if (newStatus === 'taken') {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setTimelineRoom(room);
        setIsTimelineDialogOpen(true);
      }
      return;
    }

    // If changing to 'available', clear timeline dates
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ 
          availability_status: newStatus,
          taken_from: null,
          taken_until: null
        })
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, availability_status: newStatus, taken_from: null, taken_until: null } 
            : room
        )
      );

      toast({
        title: 'Status Updated',
        description: `Room marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating room status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room status',
        variant: 'destructive',
      });
    }
  };

  const handleTimelineConfirm = async (roomId: string, takenFrom?: string, takenUntil?: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ 
          availability_status: 'taken',
          taken_from: takenFrom || null,
          taken_until: takenUntil || null
        })
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { 
                ...room, 
                availability_status: 'taken' as Room['availability_status'],
                taken_from: takenFrom || null,
                taken_until: takenUntil || null
              } 
            : room
        )
      );

      toast({
        title: 'Timeline Set',
        description: 'Room timeline has been updated',
      });
    } catch (error) {
      console.error('Error setting room timeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to set room timeline',
        variant: 'destructive',
      });
    }
  };

  const handleQuickPriceUpdate = async (roomId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .update({ price_per_night: newPrice })
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, price_per_night: newPrice } : room
        )
      );

      toast({
        title: 'Price Updated',
        description: `Room price updated to $${newPrice.toFixed(2)}`,
      });
    } catch (error) {
      console.error('Error updating room price:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room price',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', selectedRoom.id);

      if (error) {
        throw error;
      }

      setRooms((prevRooms) => 
        prevRooms.filter((room) => room.id !== selectedRoom.id)
      );
      
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedRoom(null);
    }
  };

  const validateForm = () => {
    if (!name) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a room name',
        variant: 'destructive',
      });
      return false;
    }

    if (!description) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a room description',
        variant: 'destructive',
      });
      return false;
    }

    if (!pricePerNight || isNaN(parseFloat(pricePerNight))) {
      toast({
        title: 'Invalid price',
        description: 'Please provide a valid price per night',
        variant: 'destructive',
      });
      return false;
    }

    if (!capacity || isNaN(parseInt(capacity))) {
      toast({
        title: 'Invalid capacity',
        description: 'Please provide a valid room capacity',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    setName(room.name);
    setDescription(room.description);
    setPricePerNight(String(room.price_per_night));
    setCapacity(String(room.capacity));
    setRoomNumber(room.room_number);
    setAvailabilityStatus(room.availability_status || 'available');
    setImageUrl(room.image_url || '');
    setFeaturesArray(room.features || []);
    setImagePreview(room.image_url || null);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  // Helper function to check if room is currently taken based on timeline
  const isRoomCurrentlyTaken = (room: Room) => {
    if (room.availability_status !== 'taken') return false;
    
    const today = new Date().toISOString().split('T')[0];
    
    // If no timeline dates, consider permanently taken
    if (!room.taken_from && !room.taken_until) return true;
    
    // If has start date but no end date, taken from start date onwards
    if (room.taken_from && !room.taken_until) {
      return today >= room.taken_from;
    }
    
    // If has both dates, check if today is within range
    if (room.taken_from && room.taken_until) {
      return today >= room.taken_from && today < room.taken_until;
    }
    
    // If has end date but no start date, taken until end date
    if (!room.taken_from && room.taken_until) {
      return today < room.taken_until;
    }
    
    return false;
  };

  const renderRoomDialog = (isEdit: boolean) => {
    const dialogProps = isEdit
      ? {
          open: isEditDialogOpen,
          onOpenChange: (open: boolean) => {
            if (!open) resetForm();
            setIsEditDialogOpen(open);
          },
          title: 'Edit Room',
          description: 'Update the room details.',
          onSubmit: handleEditRoom,
        }
      : {
          open: isAddDialogOpen,
          onOpenChange: (open: boolean) => {
            if (!open) resetForm();
            setIsAddDialogOpen(open);
          },
          title: 'Add New Room',
          description: 'Add a new room to the hotel.',
          onSubmit: handleAddRoom,
        };

    return (
      <Dialog open={dialogProps.open} onOpenChange={dialogProps.onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogProps.title}</DialogTitle>
            <DialogDescription>{dialogProps.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Room Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Deluxe King Room"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">
                Room Number (leave blank to auto-generate)
              </Label>
              <Input
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="01, 02, 03..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a detailed description of the room"
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price per Night <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  placeholder="299.99"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Capacity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">
                Availability Status <span className="text-destructive">*</span>
              </Label>
              <select 
                value={availabilityStatus} 
                onChange={(e) => setAvailabilityStatus(e.target.value as Room['availability_status'])}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="available">Available</option>
                <option value="taken">Taken</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="features">Features & Amenities</Label>
              <div className="flex gap-2">
                <Input
                  id="newFeature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature (e.g., WiFi, Mini Bar)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={addFeature}
                >
                  Add
                </Button>
              </div>
              
              {featuresArray.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {featuresArray.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Room Image</Label>
              <div className="flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="mb-4 overflow-hidden rounded-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-[200px] w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
                    <Hotel className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-sm"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Or provide an image URL:
                </p>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => dialogProps.onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={uploading} onClick={dialogProps.onSubmit}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEdit ? 'Update Room' : 'Add Room'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
            <p className="text-muted-foreground">Manage hotel rooms content.</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.length === 0 ? (
              <div className="col-span-full flex h-[200px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="space-y-2">
                  <Hotel className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No rooms yet</h3>
                  <p className="text-sm text-muted-foreground">Add rooms to your hotel</p>
                </div>
              </div>
            ) : (
              rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={room.image_url || '/placeholder.svg'}
                      alt={room.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-medium shadow">
                      {room.name} {room.room_number}
                    </div>
                    <div className="absolute left-2 top-2">
                      <Badge className={isRoomCurrentlyTaken(room) ? 'bg-red-500' : 'bg-green-500'}>
                        {isRoomCurrentlyTaken(room) ? 'Taken' : 'Available'}
                      </Badge>
                    </div>
                    {room.taken_from && room.taken_until && (
                      <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                        Taken: {room.taken_from} to {room.taken_until}
                      </div>
                    )}
                    {room.taken_from && !room.taken_until && (
                      <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                        Taken from: {room.taken_from}
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1 text-lg">{room.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-primary">₦{Number(room.price_per_night).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {room.description}
                    </p>
                    <div className="mt-2 flex items-center">
                      <p className="text-sm">Capacity: <span className="font-medium">{room.capacity} guests</span></p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {room.features && room.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="rounded-full bg-muted px-2 py-1 text-xs">
                          {feature}
                        </span>
                      ))}
                      {room.features && room.features.length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          +{room.features.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`price-${room.id}`} className="text-xs">Update Price (₦)</Label>
                        <div className="flex gap-1">
                          <Input 
                            id={`price-${room.id}`} 
                            type="number" 
                            min="0" 
                            step="0.01"
                            defaultValue={room.price_per_night}
                            className="h-8 text-xs"
                            onBlur={(e) => {
                              if (e.target.value && parseFloat(e.target.value) !== room.price_per_night) {
                                handleQuickPriceUpdate(room.id, parseFloat(e.target.value));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                handleQuickPriceUpdate(room.id, parseFloat(e.currentTarget.value));
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`status-${room.id}`} className="text-xs">Availability</Label>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={!isRoomCurrentlyTaken(room) ? 'default' : 'outline'} 
                            className={`h-8 w-full ${!isRoomCurrentlyTaken(room) ? 'bg-green-500 hover:bg-green-600' : ''}`}
                            onClick={() => handleQuickStatusUpdate(room.id, 'available')}
                          >
                            Available
                          </Button>
                          <Button 
                            size="sm"
                            variant={isRoomCurrentlyTaken(room) ? 'default' : 'outline'}
                            className={`h-8 w-full ${isRoomCurrentlyTaken(room) ? 'bg-red-500 hover:bg-red-600' : ''}`}
                            onClick={() => handleQuickStatusUpdate(room.id, 'taken')}
                          >
                            Taken
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(room)}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(room)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Room Dialog */}
      {renderRoomDialog(false)}

      {/* Edit Room Dialog */}
      {renderRoomDialog(true)}

      {/* Timeline Dialog */}
      <RoomTimelineDialog
        room={timelineRoom}
        isOpen={isTimelineDialogOpen}
        onClose={() => {
          setIsTimelineDialogOpen(false);
          setTimelineRoom(null);
        }}
        onConfirm={handleTimelineConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedRoom?.name}"? This action cannot be undone, and any associated bookings may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Rooms;
