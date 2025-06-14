
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem } from '@/types/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryItems();
    initializeStorage();
  }, []);

  const initializeStorage = async () => {
    try {
      console.log('Initializing storage...');
      
      // Check if bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('Existing buckets:', buckets);
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return;
      }

      const galleryBucket = buckets?.find(bucket => bucket.name === 'gallery');
      
      if (!galleryBucket) {
        console.log('Creating gallery bucket...');
        const { data: createData, error: createError } = await supabase.storage.createBucket('gallery', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error('Error creating gallery bucket:', createError);
          toast({
            title: 'Storage Setup Error',
            description: 'Failed to create storage bucket. Please contact administrator.',
            variant: 'destructive',
          });
        } else {
          console.log('Gallery bucket created successfully:', createData);
        }
      } else {
        console.log('Gallery bucket already exists');
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  };

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate all files are images
    const invalidFiles = Array.from(files).filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast({
        title: 'Error',
        description: 'Please select only image files',
        variant: 'destructive',
      });
      return;
    }

    // Check file sizes (5MB limit)
    const oversizedFiles = Array.from(files).filter(file => file.size > 5242880);
    if (oversizedFiles.length > 0) {
      toast({
        title: 'Error',
        description: 'Please select images smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress({ current: 0, total: files.length });

      console.log(`Starting upload of ${files.length} files...`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        console.log('Upload successful:', uploadData);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        console.log('Public URL:', urlData.publicUrl);

        // Insert into gallery table
        const { error: insertError } = await supabase.from('gallery').insert({
          image_url: urlData.publicUrl,
          title: file.name.split('.')[0], // Use filename without extension as title
          description: '', // Empty description
        });

        if (insertError) {
          console.error('Database insert error:', insertError);
          throw new Error(`Failed to save ${file.name} to database: ${insertError.message}`);
        }

        // Update progress
        setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      }

      await fetchGalleryItems();
      setIsUploadDialogOpen(false);
      
      toast({
        title: 'Success',
        description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`,
      });

      // Reset the file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      // Delete from storage if it's a storage URL
      if (selectedItem.image_url.includes('supabase')) {
        const urlParts = selectedItem.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage.from('gallery').remove([fileName]);
      }

      // Delete from database
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
        description: 'Image deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const confirmDelete = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
            <p className="text-muted-foreground">Manage gallery images.</p>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Images</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Select multiple images to upload at once (max 5MB each)
                  </p>
                </div>
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading images...</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Progress: {uploadProgress.current} of {uploadProgress.total}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleryItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No images found. Upload your first images to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  galleryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image_url}
                          alt="Gallery image"
                          className="h-16 w-16 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell>{item.title || 'Untitled'}</TableCell>
                      <TableCell>{format(new Date(item.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(item)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
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
    </AdminLayout>
  );
};

export default Gallery;
