
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useSuiteOperations = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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
      return '01';
    }
  };

  const uploadImage = async (imageFile: File) => {
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

    return publicURL.publicUrl;
  };

  const addSuite = async (suiteData: {
    name: string;
    description: string;
    pricePerNight: string;
    capacity: string;
    roomNumber: string;
    availabilityStatus: Room['availability_status'];
    imageUrl: string;
    featuresArray: string[];
    imageFile: File | null;
  }) => {
    try {
      setUploading(true);
      let finalImageUrl = suiteData.imageUrl;
      let finalRoomNumber = suiteData.roomNumber;

      if (!finalRoomNumber) {
        finalRoomNumber = await generateRoomNumber(suiteData.name);
      }

      if (suiteData.imageFile) {
        finalImageUrl = await uploadImage(suiteData.imageFile);
      }

      const { error: insertError } = await supabase
        .from('rooms')
        .insert({
          name: suiteData.name,
          description: suiteData.description,
          price_per_night: parseFloat(suiteData.pricePerNight),
          capacity: parseInt(suiteData.capacity),
          room_type: 'suite',
          room_number: finalRoomNumber,
          availability_status: suiteData.availabilityStatus,
          image_url: finalImageUrl || null,
          features: suiteData.featuresArray,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Success',
        description: 'Suite added successfully',
      });

      return true;
    } catch (error) {
      console.error('Error adding suite:', error);
      toast({
        title: 'Error',
        description: 'Failed to add suite',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const updateSuite = async (suiteId: string, suiteData: {
    name: string;
    description: string;
    pricePerNight: string;
    capacity: string;
    roomNumber: string;
    availabilityStatus: Room['availability_status'];
    imageUrl: string;
    featuresArray: string[];
    imageFile: File | null;
  }) => {
    try {
      setUploading(true);
      let finalImageUrl = suiteData.imageUrl;
      let finalRoomNumber = suiteData.roomNumber;

      if (!finalRoomNumber) {
        finalRoomNumber = await generateRoomNumber(suiteData.name);
      }

      if (suiteData.imageFile) {
        finalImageUrl = await uploadImage(suiteData.imageFile);
      }

      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          name: suiteData.name,
          description: suiteData.description,
          price_per_night: parseFloat(suiteData.pricePerNight),
          capacity: parseInt(suiteData.capacity),
          room_type: 'suite',
          room_number: finalRoomNumber,
          availability_status: suiteData.availabilityStatus,
          image_url: finalImageUrl || null,
          features: suiteData.featuresArray,
        })
        .eq('id', suiteId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Suite updated successfully',
      });

      return true;
    } catch (error) {
      console.error('Error updating suite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suite',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteSuite = async (suiteId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', suiteId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Suite deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting suite:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete suite',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateSuiteStatus = async (suiteId: string, newStatus: Room['availability_status']) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ availability_status: newStatus })
        .eq('id', suiteId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Suite marked as ${newStatus}`,
      });

      return true;
    } catch (error) {
      console.error('Error updating suite status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suite status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateSuitePrice = async (suiteId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .update({ price_per_night: newPrice })
        .eq('id', suiteId);

      if (error) throw error;

      toast({
        title: 'Price Updated',
        description: `Suite price updated to ₦${newPrice.toLocaleString()}`,
      });

      return true;
    } catch (error) {
      console.error('Error updating suite price:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suite price',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploading,
    addSuite,
    updateSuite,
    deleteSuite,
    updateSuiteStatus,
    updateSuitePrice,
  };
};
