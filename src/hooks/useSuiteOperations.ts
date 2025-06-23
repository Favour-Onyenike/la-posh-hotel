import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types/supabase';

export const useSuiteOperations = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const addSuite = async (suiteData: Omit<Room, 'id'>) => {
    setUploading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([suiteData])
        .select();

      if (error) {
        throw error;
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

  const updateSuite = async (suiteId: string, suiteData: Partial<Room>) => {
    setUploading(true);
    try {
      const { error } = await supabase
        .from('rooms')
        .update(suiteData)
        .eq('id', suiteId);

      if (error) {
        throw error;
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

  const updateSuitePrice = async (suiteId: string, newPrice: number) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ price_per_night: newPrice })
        .eq('id', suiteId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Suite price updated successfully',
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
    updateSuitePrice,
  };
};
