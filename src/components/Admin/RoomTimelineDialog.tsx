
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Room } from '@/types/supabase';

interface RoomTimelineDialogProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (roomId: string, takenFrom?: string, takenUntil?: string) => void;
}

const RoomTimelineDialog = ({ room, isOpen, onClose, onConfirm }: RoomTimelineDialogProps) => {
  const [takenFrom, setTakenFrom] = useState<Date>();
  const [takenUntil, setTakenUntil] = useState<Date>();
  const [isPermanent, setIsPermanent] = useState(false);

  const handleConfirm = () => {
    if (!room) return;
    
    const fromDate = takenFrom ? format(takenFrom, 'yyyy-MM-dd') : undefined;
    const untilDate = isPermanent ? undefined : (takenUntil ? format(takenUntil, 'yyyy-MM-dd') : undefined);
    
    onConfirm(room.id, fromDate, untilDate);
    handleClose();
  };

  const handleClose = () => {
    setTakenFrom(undefined);
    setTakenUntil(undefined);
    setIsPermanent(false);
    onClose();
  };

  const handleTakenFromSelect = (date: Date | undefined) => {
    setTakenFrom(date);
    // Auto-set until date to next day if not permanent
    if (date && !isPermanent && !takenUntil) {
      setTakenUntil(addDays(date, 1));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Room Timeline</DialogTitle>
          <DialogDescription>
            Set the dates when "{room?.name} {room?.room_number}" will be taken/unavailable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Taken From (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {takenFrom ? format(takenFrom, 'MMM dd, yyyy') : 'Select start date (leave empty for immediate)'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={takenFrom}
                  onSelect={handleTakenFromSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="permanent"
              checked={isPermanent}
              onChange={(e) => {
                setIsPermanent(e.target.checked);
                if (e.target.checked) {
                  setTakenUntil(undefined);
                }
              }}
              className="rounded"
            />
            <Label htmlFor="permanent">Mark as permanently taken (no end date)</Label>
          </div>

          {!isPermanent && (
            <div className="space-y-2">
              <Label>Available Again On</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {takenUntil ? format(takenUntil, 'MMM dd, yyyy') : 'Select end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={takenUntil}
                    onSelect={setTakenUntil}
                    disabled={(date) => 
                      date < new Date() || 
                      (takenFrom && date <= takenFrom)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Timeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomTimelineDialog;
