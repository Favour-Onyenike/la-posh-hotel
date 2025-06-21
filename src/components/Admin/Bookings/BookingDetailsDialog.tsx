
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format, differenceInDays } from 'date-fns';
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

  // Calculate nights and price breakdown
  const checkInDate = new Date(booking.check_in_date);
  const checkOutDate = new Date(booking.check_out_date);
  const nights = differenceInDays(checkOutDate, checkInDate);
  const pricePerNight = nights > 0 ? booking.total_price / nights : 0;

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
              <Label className="text-sm font-medium">Status</Label>
              <p className="text-sm capitalize">{booking.status}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Check-in</Label>
              <p className="text-sm">{format(checkInDate, 'PPP')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Check-out</Label>
              <p className="text-sm">{format(checkOutDate, 'PPP')}</p>
            </div>
          </div>
          
          {/* Price Breakdown Section */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Price Breakdown</Label>
            <div className="bg-gray-50 p-3 rounded mt-2">
              <div className="flex justify-between text-sm">
                <span>₦{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>₦{booking.total_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm mt-2 pt-2 border-t">
                <span>Total Amount</span>
                <span>₦{booking.total_price.toLocaleString()}</span>
              </div>
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
