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

const Suites = () => {
  const [suites, setSuites] = useState<Room[]>([]);
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
  const [selectedSuite, setSelectedSuite] = useState<Room | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'suite')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      // Ensure all suites have an availability_status property
      const suitesWithDefaultStatus = (data || []).map(suite => ({
        ...suite,
        availability_status: suite.availability_status || 'available' as Room['availability_status']
      }));

      setSuites(suitesWithDefaultStatus as Room[]);
    } catch (error) {
      console.error('Error fetching suites:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch suites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRoomNumber = async (suiteName: string) => {
    try {
      const { data: existingSuites, error } = await supabase
        .from('rooms')
        .select('room_number')
        .eq('name', suiteName)
        .eq('room_type', 'suite')
        .order('room_number', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!existingSuites || existingSuites.length === 0) {
        return '01';
      }

      const lastRoomNumber = existingSuites[0].room_number;
      const nextNumber = parseInt(lastRoomNumber) + 1;
      return nextNumber.toString().padStart(2, '0');
    } catch (error) {
      console.error('Error generating suite number:', error);
      return '01'; // fallback to 01 if there's an error
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

  const handleAddSuite = async () => {
    if (!validateForm()) return;

    try {
      setUploading(true);
      let finalImageUrl = imageUrl;
      let finalRoomNumber = roomNumber;

      // Auto-generate suite number if not provided - based on suite name
      if (!finalRoomNumber) {
        finalRoomNumber = await generateRoomNumber(name);
      }

      // If there's a file to upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `suites/${fileName}`;

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

      // Add the suite to the database
      const { error: insertError } = await supabase
        .from('rooms')
        .insert({
          name,
          description,
          price_per_night: parseFloat(pricePerNight),
          capacity: parseInt(capacity),
          room_type: 'suite',
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
        description: 'Suite added successfully',
      });

      // Refresh the suites list
      fetchSuites();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding suite:', error);
      toast({
        title: 'Error',
        description: 'Failed to add suite',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditSuite = async () => {
    if (!validateForm() || !selectedSuite) return;

    try {
      setUploading(true);
      let finalImageUrl = imageUrl;
      let finalRoomNumber = roomNumber;

      // Auto-generate suite number if not provided - based on suite name
      if (!finalRoomNumber) {
        finalRoomNumber = await generateRoomNumber(name);
      }

      // If there's a file to upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `suites/${fileName}`;

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

      // Update the suite in the database
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          name,
          description,
          price_per_night: parseFloat(pricePerNight),
          capacity: parseInt(capacity),
          room_type: 'suite',
          room_number: finalRoomNumber,
          availability_status: availabilityStatus,
          image_url: finalImageUrl || null,
          features: featuresArray,
        })
        .eq('id', selectedSuite.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Suite updated successfully',
      });

      // Refresh the suites list
      fetchSuites();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating suite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suite',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleQuickStatusUpdate = async (suiteId: string, newStatus: Room['availability_status']) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ availability_status: newStatus })
        .eq('id', suiteId);

      if (error) throw error;

      // Update local state
      setSuites(prevSuites => 
        prevSuites.map(suite => 
          suite.id === suiteId ? { ...suite, availability_status: newStatus } : suite
        )
      );

      toast({
        title: 'Status Updated',
        description: `Suite marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating suite status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suite status',
        variant: 'destructive',
      });
    }
  };

  const handleQuickPriceUpdate = async (suiteId: string, newPrice: number) => {
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
        .eq('id', suiteId);

      if (error) throw error;

      // Update local state
      setSuites(prevSuites => 
        prevSuites.map(suite => 
          suite.id === suiteId ? { ...suite, price_per_night: newPrice } : suite
        )
      );

      toast({
        title: 'Price Updated',
        description: `Suite price updated to ₦${newPrice.toLocaleString()}`,
      });
    } catch (error) {
      console.error('Error updating suite price:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suite price',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSuite = async () => {
    if (!selectedSuite) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', selectedSuite.id);

      if (error) {
        throw error;
      }

      setSuites((prevSuites) => 
        prevSuites.filter((suite) => suite.id !== selectedSuite.id)
      );
      
      toast({
        title: 'Success',
        description: 'Suite deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting suite:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete suite',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSuite(null);
    }
  };

  const validateForm = () => {
    if (!name) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a suite name',
        variant: 'destructive',
      });
      return false;
    }

    if (!description) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a suite description',
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
        description: 'Please provide a valid suite capacity',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const openEditDialog = (suite: Room) => {
    setSelectedSuite(suite);
    setName(suite.name);
    setDescription(suite.description);
    setPricePerNight(String(suite.price_per_night));
    setCapacity(String(suite.capacity));
    setRoomNumber(suite.room_number);
    setAvailabilityStatus(suite.availability_status || 'available');
    setImageUrl(suite.image_url || '');
    setFeaturesArray(suite.features || []);
    setImagePreview(suite.image_url || null);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (suite: Room) => {
    setSelectedSuite(suite);
    setIsDeleteDialogOpen(true);
  };

  const renderSuiteDialog = (isEdit: boolean) => {
    const dialogProps = isEdit
      ? {
          open: isEditDialogOpen,
          onOpenChange: (open: boolean) => {
            if (!open) resetForm();
            setIsEditDialogOpen(open);
          },
          title: 'Edit Suite',
          description: 'Update the suite details.',
          onSubmit: handleEditSuite,
        }
      : {
          open: isAddDialogOpen,
          onOpenChange: (open: boolean) => {
            if (!open) resetForm();
            setIsAddDialogOpen(open);
          },
          title: 'Add New Suite',
          description: 'Add a new suite to the hotel.',
          onSubmit: handleAddSuite,
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
                Suite Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Presidential Suite"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">
                Suite Number (leave blank to auto-generate)
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
                placeholder="Write a detailed description of the suite"
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price per Night (₦) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  placeholder="45000"
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
                  placeholder="4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">
                Availability Status <span className="text-destructive">*</span>
              </Label>
              <select
                id="availability"
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as Room['availability_status'])}
                className="w-full p-2 border rounded-md"
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
                  placeholder="Add a feature (e.g., Jacuzzi, Private Balcony)"
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
              <Label htmlFor="image">Suite Image</Label>
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
                isEdit ? 'Update Suite' : 'Add Suite'
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
            <h2 className="text-3xl font-bold tracking-tight">Suites</h2>
            <p className="text-muted-foreground">Manage hotel suites content.</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Suite
          </Button>
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suites.length === 0 ? (
              <div className="col-span-full flex h-[200px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="space-y-2">
                  <Hotel className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No suites yet</h3>
                  <p className="text-sm text-muted-foreground">Add suites to your hotel</p>
                </div>
              </div>
            ) : (
              suites.map((suite) => (
                <Card key={suite.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={suite.image_url || '/placeholder.svg'}
                      alt={suite.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-medium shadow">
                      {suite.name} {suite.room_number}
                    </div>
                    <div className="absolute left-2 top-2">
                      <Badge className={suite.availability_status === 'available' ? 'bg-green-500' : 'bg-red-500'}>
                        {suite.availability_status === 'available' ? 'Available' : 'Taken'}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1 text-lg">{suite.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-primary">₦{Number(suite.price_per_night).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {suite.description}
                    </p>
                    <div className="mt-2 flex items-center">
                      <p className="text-sm">Capacity: <span className="font-medium">{suite.capacity} guests</span></p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {suite.features && suite.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="rounded-full bg-muted px-2 py-1 text-xs">
                          {feature}
                        </span>
                      ))}
                      {suite.features && suite.features.length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          +{suite.features.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`price-${suite.id}`} className="text-xs">Update Price (₦)</Label>
                        <div className="flex gap-1">
                          <Input 
                            id={`price-${suite.id}`} 
                            type="number" 
                            min="0" 
                            step="0.01"
                            defaultValue={suite.price_per_night}
                            className="h-8 text-xs"
                            onBlur={(e) => {
                              if (e.target.value && parseFloat(e.target.value) !== suite.price_per_night) {
                                handleQuickPriceUpdate(suite.id, parseFloat(e.target.value));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                handleQuickPriceUpdate(suite.id, parseFloat(e.currentTarget.value));
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`status-${suite.id}`} className="text-xs">Availability</Label>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={suite.availability_status === 'available' ? 'default' : 'outline'} 
                            className={`h-8 w-full ${suite.availability_status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                            onClick={() => handleQuickStatusUpdate(suite.id, 'available')}
                          >
                            Available
                          </Button>
                          <Button 
                            size="sm"
                            variant={suite.availability_status === 'taken' ? 'default' : 'outline'}
                            className={`h-8 w-full ${suite.availability_status === 'taken' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                            onClick={() => handleQuickStatusUpdate(suite.id, 'taken')}
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
                        onClick={() => openEditDialog(suite)}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(suite)}
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

      {/* Add Suite Dialog */}
      {renderSuiteDialog(false)}

      {/* Edit Suite Dialog */}
      {renderSuiteDialog(true)}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Suite</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSuite?.name}"? This action cannot be undone, and any associated bookings may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSuite} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Suites;
