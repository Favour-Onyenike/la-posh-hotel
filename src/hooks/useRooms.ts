
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/supabase";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'room')
        .order('name', { ascending: true })
        .order('room_number', { ascending: true });

      if (error) {
        console.error('Error fetching rooms:', error);
        return;
      }

      // Ensure all rooms have proper typing for availability_status
      const roomsWithProperTypes = (data || []).map(room => ({
        ...room,
        availability_status: room.availability_status as Room['availability_status']
      }));

      setRooms(roomsWithProperTypes as Room[]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, loading, refetch: fetchRooms };
};
