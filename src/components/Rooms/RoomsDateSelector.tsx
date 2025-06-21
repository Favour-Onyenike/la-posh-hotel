
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface RoomsDateSelectorProps {
  checkInDate?: string;
  checkOutDate?: string;
  onDatesChange: (checkIn?: string, checkOut?: string) => void;
}

const RoomsDateSelector = ({ checkInDate, checkOutDate, onDatesChange }: RoomsDateSelectorProps) => {
  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      const checkInStr = format(date, 'yyyy-MM-dd');
      const checkOutStr = checkOutDate || format(addDays(date, 1), 'yyyy-MM-dd');
      onDatesChange(checkInStr, checkOutStr);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date && checkInDate) {
      const checkOutStr = format(date, 'yyyy-MM-dd');
      onDatesChange(checkInDate, checkOutStr);
    }
  };

  const clearDates = () => {
    onDatesChange(undefined, undefined);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkInDate ? format(new Date(checkInDate), 'MMM dd, yyyy') : 'Check-in date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkInDate ? new Date(checkInDate) : undefined}
              onSelect={handleCheckInSelect}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOutDate ? format(new Date(checkOutDate), 'MMM dd, yyyy') : 'Check-out date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkOutDate ? new Date(checkOutDate) : undefined}
              onSelect={handleCheckOutSelect}
              disabled={(date) => 
                date < new Date() || 
                (checkInDate && date <= new Date(checkInDate))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" onClick={clearDates}>
        Clear Dates
      </Button>
    </div>
  );
};

export default RoomsDateSelector;
