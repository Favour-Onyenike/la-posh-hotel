
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Calendar, User, Home, Eye, Trash2, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Booking, Room } from '@/types/supabase';

interface BookingTableRowProps {
  booking: Booking;
  room: Room | undefined;
  onView: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking,
  room,
  onView,
  onUpdateStatus,
  onDelete,
}) => {
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'checked_in':
        return <Badge className="bg-blue-500 text-white">Checked In</Badge>;
      case 'checked_out':
        return <Badge className="bg-gray-500 text-white">Checked Out</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{booking.guest_name}</div>
            <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {room ? (
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4 text-muted-foreground" />
            <div>
              <div>{room.name}</div>
              <div className="text-sm text-muted-foreground">{room.room_number}</div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Room Not Found</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(booking.check_in_date), 'MMM d, yyyy')}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          ₦{booking.total_price.toLocaleString()}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(booking.status)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(booking)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(booking)}
          >
            Update Status
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(booking)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default BookingTableRow;
