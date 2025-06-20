
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Hotel } from 'lucide-react';
import SuiteCard from '@/components/Admin/Suites/SuiteCard';
import SuiteDialog from '@/components/Admin/Suites/SuiteDialog';
import SuiteDeleteDialog from '@/components/Admin/Suites/SuiteDeleteDialog';
import { useSuiteOperations } from '@/hooks/useSuiteOperations';
import { useToast } from '@/hooks/use-toast';

const Suites = () => {
  const [suites, setSuites] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<Room | null>(null);
  
  const { 
    uploading, 
    addSuite, 
    updateSuite, 
    deleteSuite, 
    updateSuiteStatus, 
    updateSuitePrice 
  } = useSuiteOperations();
  
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

  const handleAddSuite = async (suiteData: any) => {
    const success = await addSuite(suiteData);
    if (success) {
      fetchSuites();
    }
    return success;
  };

  const handleEditSuite = async (suiteData: any) => {
    if (!selectedSuite) return false;
    const success = await updateSuite(selectedSuite.id, suiteData);
    if (success) {
      fetchSuites();
    }
    return success;
  };

  const handleDeleteSuite = async () => {
    if (!selectedSuite) return;
    const success = await deleteSuite(selectedSuite.id);
    if (success) {
      setSuites(prevSuites => 
        prevSuites.filter(suite => suite.id !== selectedSuite.id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedSuite(null);
    }
  };

  const handleStatusUpdate = async (suiteId: string, newStatus: Room['availability_status']) => {
    const success = await updateSuiteStatus(suiteId, newStatus);
    if (success) {
      setSuites(prevSuites => 
        prevSuites.map(suite => 
          suite.id === suiteId ? { ...suite, availability_status: newStatus } : suite
        )
      );
    }
  };

  const handlePriceUpdate = async (suiteId: string, newPrice: number) => {
    const success = await updateSuitePrice(suiteId, newPrice);
    if (success) {
      setSuites(prevSuites => 
        prevSuites.map(suite => 
          suite.id === suiteId ? { ...suite, price_per_night: newPrice } : suite
        )
      );
    }
  };

  const openEditDialog = (suite: Room) => {
    setSelectedSuite(suite);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (suite: Room) => {
    setSelectedSuite(suite);
    setIsDeleteDialogOpen(true);
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
                <SuiteCard
                  key={suite.id}
                  suite={suite}
                  onEdit={openEditDialog}
                  onDelete={confirmDelete}
                  onStatusUpdate={handleStatusUpdate}
                  onPriceUpdate={handlePriceUpdate}
                />
              ))
            )}
          </div>
        )}
      </div>

      <SuiteDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        suite={null}
        onSubmit={handleAddSuite}
        uploading={uploading}
        isEdit={false}
      />

      <SuiteDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        suite={selectedSuite}
        onSubmit={handleEditSuite}
        uploading={uploading}
        isEdit={true}
      />

      <SuiteDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        suite={selectedSuite}
        onConfirm={handleDeleteSuite}
      />
    </AdminLayout>
  );
};

export default Suites;
