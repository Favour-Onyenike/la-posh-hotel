
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types/supabase';

export const useRoomAvailability = (
  rooms: Room[],
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  setAvailableRooms: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();

  const toggleRoomAvailability = async (roomId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'taken' : 'available';
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ availability_status: newStatus })
        .eq('id', roomId);
        
      if (error) {
        console.error('Error updating room status:', error);
        toast({
          title: "Update failed",
          description: "Could not update room availability. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state to reflect the change
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, availability_status: newStatus } 
            : room
        )
      );
      
      // Update available rooms count
      const updatedAvailableRooms = rooms
        .map(room => room.id === roomId 
          ? { ...room, availability_status: newStatus } 
          : room
        )
        .filter(room => room.availability_status === 'available')
        .length;
        
      setAvailableRooms(updatedAvailableRooms);
      
      toast({
        title: "Status updated",
        description: `Room status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error toggling room availability:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { toggleRoomAvailability };
};
