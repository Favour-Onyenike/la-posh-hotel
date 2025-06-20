
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking, Room } from '@/types/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBookingOperations } from '@/hooks/useBookingOperations';
import BookingTable from '@/components/Admin/Bookings/BookingTable';
import BookingDetailsDialog from '@/components/Admin/Bookings/BookingDetailsDialog';
import BookingStatusDialog from '@/components/Admin/Bookings/BookingStatusDialog';
import BookingDeleteDialog from '@/components/Admin/Bookings/BookingDeleteDialog';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Booking['status']>('pending');
  
  const { toast } = useToast();
  const { handleStatusUpdate, handleDeleteBooking } = useBookingOperations();

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');

      if (error) {
        throw error;
      }

      setRooms(data as Room[]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      });
    }
  };

  const onStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      await handleStatusUpdate(
        selectedBooking,
        newStatus,
        rooms,
        (updatedBooking) => {
          setBookings(bookings.map(booking =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          ));
        }
      );
    } finally {
      setIsStatusDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const onDeleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      await handleDeleteBooking(
        selectedBooking,
        (deletedBookingId) => {
          setBookings(bookings.filter(booking => booking.id !== deletedBookingId));
        }
      );
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsStatusDialogOpen(true);
    setNewStatus(booking.status);
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings Management</h2>
          <p className="text-muted-foreground">Manage all hotel bookings and reservations.</p>
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <BookingTable
            bookings={bookings}
            rooms={rooms}
            onView={handleView}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        )}
      </div>

      <BookingDetailsDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        booking={selectedBooking}
      />

      <BookingStatusDialog
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        booking={selectedBooking}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        onConfirm={onStatusUpdate}
      />

      <BookingDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        booking={selectedBooking}
        onConfirm={onDeleteBooking}
      />
    </AdminLayout>
  );
};

export default Bookings;
