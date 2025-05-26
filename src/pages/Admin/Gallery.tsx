
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem } from '@/types/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';
import BulkUploadDialog from '@/components/Admin/BulkUploadDialog';
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
import { Loader2, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch gallery items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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

  const handleAddGalleryItem = async () => {
    if (!imageFile) {
      toast({
        title: 'Missing image',
        description: 'Please upload an image',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      // 1. Upload the image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get the public URL
      const { data: publicURL } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      if (!publicURL) {
        throw new Error('Failed to get public URL');
      }

      // 3. Add the gallery item to the database
      const { error: insertError } = await supabase
        .from('gallery')
        .insert({
          title: title || imageFile.name.split('.')[0],
          description: description || null,
          image_url: publicURL.publicUrl,
          category: category || null,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Success',
        description: 'Gallery item added successfully',
      });

      // 4. Refresh the gallery items
      fetchGalleryItems();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add gallery item',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      // 1. Delete the image from Supabase Storage if it's stored there
      const imagePath = selectedItem.image_url.includes('storage/v1/object/public/gallery/') 
        ? selectedItem.image_url.split('public/gallery/')[1]
        : null;

      if (imagePath) {
        const { error: deleteStorageError } = await supabase.storage
          .from('gallery')
          .remove([`gallery/${imagePath}`]);

        if (deleteStorageError) {
          console.error('Error deleting image from storage:', deleteStorageError);
          // Continue with deletion even if storage deletion fails
        }
      }

      // 2. Delete the gallery item from the database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', selectedItem.id);

      if (error) {
        throw error;
      }

      setGalleryItems((prevItems) => 
        prevItems.filter((item) => item.id !== selectedItem.id)
      );
      
      toast({
        title: 'Success',
        description: 'Gallery item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete gallery item',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;

    try {
      // Delete the selected items from the database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .in('id', selectedImages);

      if (error) {
        throw error;
      }

      setGalleryItems((prevItems) => 
        prevItems.filter((item) => !selectedImages.includes(item.id))
      );
      
      toast({
        title: 'Success',
        description: `${selectedImages.length} gallery items deleted successfully`,
      });
      
      // Reset selection
      setSelectedImages([]);
      setBulkDeleteMode(false);
    } catch (error) {
      console.error('Error deleting gallery items:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected gallery items',
        variant: 'destructive',
      });
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(itemId => itemId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const confirmDelete = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    if (selectedImages.length > 0) {
      setIsBulkDeleteDialogOpen(true);
    } else {
      toast({
        title: 'No images selected',
        description: 'Please select at least one image to delete',
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
            <p className="text-muted-foreground">Manage hotel gallery images and photos</p>
          </div>
          <div className="flex gap-2">
            {bulkDeleteMode ? (
              <>
                <Button 
                  variant="destructive"
                  disabled={selectedImages.length === 0}
                  onClick={confirmBulkDelete}
                >
                  Delete Selected ({selectedImages.length})
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setBulkDeleteMode(false);
                    setSelectedImages([]);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setBulkDeleteMode(true)} variant="outline">
                  Bulk Delete
                </Button>
                <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Bulk Upload
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Single Image
                </Button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryItems.length === 0 ? (
              <div className="col-span-full flex h-[200px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="space-y-2">
                  <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No images yet</h3>
                  <p className="text-sm text-muted-foreground">Add images to your gallery</p>
                </div>
              </div>
            ) : (
              galleryItems.map((item) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden ${bulkDeleteMode && selectedImages.includes(item.id) ? 'ring-2 ring-primary' : ''}`}
                >
                  <div 
                    className="relative aspect-video cursor-pointer"
                    onClick={() => bulkDeleteMode && toggleImageSelection(item.id)}
                  >
                    {bulkDeleteMode && (
                      <div className="absolute left-2 top-2 z-10">
                        <input 
                          type="checkbox" 
                          checked={selectedImages.includes(item.id)}
                          onChange={() => toggleImageSelection(item.id)}
                          className="h-5 w-5 rounded border-gray-300"
                        />
                      </div>
                    )}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {item.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.category && (
                      <div className="mt-2">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    {!bulkDeleteMode && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-auto"
                        onClick={() => confirmDelete(item)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onSuccess={fetchGalleryItems}
      />

      {/* Add Gallery Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsAddDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
            <DialogDescription>
              Upload a new image to the hotel gallery. Title and description are optional.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">
                Title (optional)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave empty to use filename"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Description (optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-right">
                Category (optional)
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Rooms, Dining, Pool"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image" className="text-right">
                Image <span className="text-destructive">*</span>
              </Label>
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
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} onClick={handleAddGalleryItem}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                'Add Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Gallery Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedImages.length} selected images? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete {selectedImages.length} Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Gallery;
