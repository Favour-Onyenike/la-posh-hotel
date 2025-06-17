
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useBookingLogic = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterAndSortRooms();
  }, [rooms, showOnlyAvailable, roomTypeFilter, checkInDate, checkOutDate, guests]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms...');
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('availability_status', { ascending: false })
        .order('room_type', { ascending: true })
        .order('price_per_night', { ascending: true });

      if (error) {
        console.error('Error fetching rooms:', error);
        throw error;
      }

      console.log('Rooms fetched successfully:', data?.length || 0);
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRooms = () => {
    let filtered = [...rooms];

    // Filter by availability status
    if (showOnlyAvailable) {
      filtered = filtered.filter(room => room.availability_status === 'available');
    }

    // Filter by room type
    if (roomTypeFilter !== 'all') {
      filtered = filtered.filter(room => room.room_type === roomTypeFilter);
    }

    // Filter by capacity
    filtered = filtered.filter(room => room.capacity >= guests);

    // Sort rooms - available first, then by price
    filtered.sort((a, b) => {
      if (a.availability_status !== b.availability_status) {
        return a.availability_status === 'available' ? -1 : 1;
      }
      return a.price_per_night - b.price_per_night;
    });

    setFilteredRooms(filtered);
  };

  const checkRoomAvailability = async (room: Room): Promise<boolean> => {
    if (!checkInDate || !checkOutDate) {
      // If no dates selected, just check the room's general availability status
      return room.availability_status === 'available';
    }

    try {
      console.log('Checking availability for room:', room.id, 'from', checkInDate, 'to', checkOutDate);
      
      const { data, error } = await supabase.rpc('is_room_available', {
        room_id_param: room.id,
        check_in_param: checkInDate,
        check_out_param: checkOutDate
      });

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      const isAvailable = data && room.availability_status === 'available';
      console.log('Room availability result:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Error checking room availability:', error);
      return false;
    }
  };

  const handleBookRoom = async (room: Room): Promise<Room | null> => {
    try {
      console.log('Attempting to book room:', room.id);
      
      const isAvailable = await checkRoomAvailability(room);
      
      if (!isAvailable) {
        toast({
          title: 'Room Unavailable',
          description: 'This room is not available for the selected dates.',
          variant: 'destructive',
        });
        return null;
      }

      // Validate dates if they are provided
      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
          toast({
            title: 'Invalid Date',
            description: 'Check-in date cannot be in the past.',
            variant: 'destructive',
          });
          return null;
        }

        if (checkOut <= checkIn) {
          toast({
            title: 'Invalid Date Range',
            description: 'Check-out date must be after check-in date.',
            variant: 'destructive',
          });
          return null;
        }
      }

      console.log('Room booking validation passed');
      return room;
    } catch (error) {
      console.error('Error in handleBookRoom:', error);
      toast({
        title: 'Booking Error',
        description: 'An error occurred while processing your booking request.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    rooms,
    filteredRooms,
    loading,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    guests,
    setGuests,
    showOnlyAvailable,
    setShowOnlyAvailable,
    roomTypeFilter,
    setRoomTypeFilter,
    handleBookRoom,
    fetchRooms
  };
};
