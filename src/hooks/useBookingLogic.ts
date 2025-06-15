
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
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('availability_status', { ascending: false })
        .order('room_type', { ascending: true })
        .order('price_per_night', { ascending: true });

      if (error) {
        throw error;
      }

      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRooms = () => {
    let filtered = [...rooms];

    if (showOnlyAvailable) {
      filtered = filtered.filter(room => room.availability_status === 'available');
    }

    if (roomTypeFilter !== 'all') {
      filtered = filtered.filter(room => room.room_type === roomTypeFilter);
    }

    filtered = filtered.filter(room => room.capacity >= guests);

    filtered.sort((a, b) => {
      if (a.availability_status !== b.availability_status) {
        return a.availability_status === 'available' ? -1 : 1;
      }
      return a.price_per_night - b.price_per_night;
    });

    setFilteredRooms(filtered);
  };

  const checkRoomAvailability = async (room: Room) => {
    if (!checkInDate || !checkOutDate) {
      return room.availability_status === 'available';
    }

    try {
      const { data, error } = await supabase.rpc('is_room_available', {
        room_id_param: room.id,
        check_in_param: checkInDate,
        check_out_param: checkOutDate
      });

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      return data && room.availability_status === 'available';
    } catch (error) {
      console.error('Error checking room availability:', error);
      return false;
    }
  };

  const handleBookRoom = async (room: Room) => {
    const isAvailable = await checkRoomAvailability(room);
    
    if (!isAvailable) {
      toast({
        title: 'Room Unavailable',
        description: 'This room is not available for the selected dates.',
        variant: 'destructive',
      });
      return;
    }

    return room;
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
