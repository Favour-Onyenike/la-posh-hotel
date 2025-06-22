
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types/supabase';

export const useRoomAvailability = (
  rooms: Room[],
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  setAvailableRooms: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();

  const toggleRoomAvailability = async (
    roomId: string, 
    currentStatus: string, 
    takenFrom?: string, 
    takenUntil?: string
  ) => {
    const newStatus = currentStatus === 'available' ? 'taken' : 'available';
    
    try {
      // Prepare update data
      const updateData: any = { availability_status: newStatus };
      
      // If setting to taken and timeline provided, include timeline
      if (newStatus === 'taken') {
        updateData.taken_from = takenFrom || null;
        updateData.taken_until = takenUntil || null;
      } else {
        // If setting to available, clear timeline
        updateData.taken_from = null;
        updateData.taken_until = null;
      }

      const { error } = await supabase
        .from('rooms')
        .update(updateData)
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
            ? { 
                ...room, 
                availability_status: newStatus,
                taken_from: updateData.taken_from,
                taken_until: updateData.taken_until
              } 
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
      
      const timelineInfo = takenFrom && takenUntil 
        ? ` (from ${takenFrom} to ${takenUntil})`
        : takenFrom 
        ? ` (from ${takenFrom})`
        : takenUntil 
        ? ` (until ${takenUntil})`
        : '';
      
      toast({
        title: "Status updated",
        description: `Room status changed to ${newStatus}${timelineInfo}`,
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
