
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import BookingTableRow from './BookingTableRow';
import { Booking, Room } from '@/types/supabase';

interface BookingTableProps {
  bookings: Booking[];
  rooms: Room[];
  onView: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  rooms,
  onView,
  onUpdateStatus,
  onDelete,
}) => {
  const getRoomById = (roomId: string | null): Room | undefined => {
    return rooms.find(room => room.id === roomId);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No bookings found. Bookings will appear here once customers make reservations.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <BookingTableRow
                key={booking.id}
                booking={booking}
                room={getRoomById(booking.room_id)}
                onView={onView}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingTable;
