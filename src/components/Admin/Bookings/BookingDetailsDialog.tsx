
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Booking } from '@/types/supabase';

interface BookingDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  booking,
}) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Guest Name</Label>
              <p className="text-sm">{booking.guest_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm">{booking.guest_email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <p className="text-sm">{booking.guest_phone || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Total Price</Label>
              <p className="text-sm">₦{booking.total_price.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Check-in</Label>
              <p className="text-sm">{format(new Date(booking.check_in_date), 'PPP')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Check-out</Label>
              <p className="text-sm">{format(new Date(booking.check_out_date), 'PPP')}</p>
            </div>
          </div>
          {booking.special_requests && (
            <div>
              <Label className="text-sm font-medium">Special Requests</Label>
              <p className="text-sm bg-gray-50 p-2 rounded">{booking.special_requests}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
