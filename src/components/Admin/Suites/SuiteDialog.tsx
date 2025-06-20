
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Hotel, X } from 'lucide-react';
import { Room } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

interface SuiteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suite: Room | null;
  onSubmit: (suiteData: any) => Promise<boolean>;
  uploading: boolean;
  isEdit: boolean;
}

const SuiteDialog: React.FC<SuiteDialogProps> = ({
  isOpen,
  onOpenChange,
  suite,
  onSubmit,
  uploading,
  isEdit,
}) => {
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
  
  const { toast } = useToast();

  useEffect(() => {
    if (isEdit && suite) {
      setName(suite.name);
      setDescription(suite.description);
      setPricePerNight(String(suite.price_per_night));
      setCapacity(String(suite.capacity));
      setRoomNumber(suite.room_number);
      setAvailabilityStatus(suite.availability_status || 'available');
      setImageUrl(suite.image_url || '');
      setFeaturesArray(suite.features || []);
      setImagePreview(suite.image_url || null);
    } else {
      resetForm();
    }
  }, [isEdit, suite, isOpen]);

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const suiteData = {
      name,
      description,
      pricePerNight,
      capacity,
      roomNumber,
      availabilityStatus,
      imageUrl,
      featuresArray,
      imageFile,
    };

    const success = await onSubmit(suiteData);
    if (success) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Suite' : 'Add New Suite'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the suite details.' : 'Add a new suite to the hotel.'}
          </DialogDescription>
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={uploading} onClick={handleSubmit}>
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

export default SuiteDialog;
