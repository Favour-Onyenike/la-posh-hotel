
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Booking, Room } from '@/types/supabase';

export const useBookingOperations = () => {
  const { toast } = useToast();

  const handleStatusUpdate = async (
    booking: Booking,
    newStatus: Booking['status'],
    rooms: Room[],
    onSuccess: (updatedBooking: Booking) => void
  ) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) {
        throw error;
      }

      const updatedBooking = { ...booking, status: newStatus };
      onSuccess(updatedBooking);

      // Send confirmation email if status is changed to "confirmed"
      if (newStatus === 'confirmed') {
        const room = rooms.find(r => r.id === booking.room_id);
        if (room) {
          try {
            console.log('Sending booking confirmation email...');
            const { error: emailError } = await supabase.functions.invoke('send-booking-confirmation', {
              body: {
                guestName: booking.guest_name,
                guestEmail: booking.guest_email,
                roomName: room.name,
                roomNumber: room.room_number,
                checkInDate: booking.check_in_date,
                checkOutDate: booking.check_out_date,
                totalPrice: booking.total_price,
                bookingId: booking.id
              }
            });

            if (emailError) {
              console.error('Error sending confirmation email:', emailError);
              toast({
                title: 'Status Updated',
                description: 'Booking confirmed but failed to send confirmation email. Please contact the guest directly.',
                variant: 'destructive',
              });
            } else {
              toast({
                title: 'Booking Confirmed',
                description: 'Booking status updated and confirmation email sent to guest.',
              });
            }
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            toast({
              title: 'Status Updated',
              description: 'Booking confirmed but failed to send confirmation email. Please contact the guest directly.',
              variant: 'destructive',
            });
          }
        }
      } else {
        toast({
          title: 'Success',
          description: 'Booking status updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteBooking = async (
    booking: Booking,
    onSuccess: (deletedBookingId: string) => void
  ) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) {
        throw error;
      }

      onSuccess(booking.id);

      toast({
        title: 'Success',
        description: 'Booking deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    handleStatusUpdate,
    handleDeleteBooking,
  };
};
