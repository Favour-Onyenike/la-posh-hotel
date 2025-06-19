
import React, { useState } from 'react';
import { Room } from '@/types/supabase';
import BookingForm from '@/components/BookingForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingHero from '@/components/booking/BookingHero';
import BookingFilters from '@/components/booking/BookingFilters';
import RoomsList from '@/components/booking/RoomsList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useBookingLogic } from '@/hooks/useBookingLogic';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Users, Home } from 'lucide-react';

const Booking = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { toast } = useToast();
  
  const {
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
  } = useBookingLogic();

  // Check if all required booking parameters are filled
  const isBookingParametersComplete = checkInDate && checkOutDate && guests > 0 && roomTypeFilter !== 'all';

  const onBookRoom = async (room: Room) => {
    // Validate that all required parameters are filled before proceeding
    if (!isBookingParametersComplete) {
      toast({
        title: 'Missing Information',
        description: 'Please select check-in date, check-out date, number of guests, and room type before booking.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Booking room:', room.id);
    
    const bookableRoom = await handleBookRoom(room);
    if (bookableRoom) {
      setSelectedRoom(bookableRoom);
    }
  };

  const handleBookingSuccess = () => {
    setSelectedRoom(null);
    fetchRooms();
    toast({
      title: 'Booking Successful! 🎉',
      description: 'Your booking has been submitted successfully.',
    });
  };

  const handleCancelBooking = () => {
    setSelectedRoom(null);
  };

  // Convert date strings to Date objects for BookingForm
  const getDateFromString = (dateString: string): Date => {
    return new Date(dateString);
  };

  const checkInDateObj = getDateFromString(checkInDate);
  const checkOutDateObj = getDateFromString(checkOutDate);

  if (selectedRoom && isBookingParametersComplete) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8" style={{ marginTop: '80px' }}>
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedRoom(null)}
                className="mb-4"
              >
                ← Back to Rooms
              </Button>
            </div>
            <BookingForm 
              room={selectedRoom} 
              onBookingComplete={handleBookingSuccess}
              onCancel={handleCancelBooking}
              checkInDate={checkInDateObj}
              checkOutDate={checkOutDateObj}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <BookingHero />
        
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <BookingFilters
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              guests={guests}
              setGuests={setGuests}
              roomTypeFilter={roomTypeFilter}
              setRoomTypeFilter={setRoomTypeFilter}
              showOnlyAvailable={showOnlyAvailable}
              setShowOnlyAvailable={setShowOnlyAvailable}
              filteredRoomsCount={filteredRooms.length}
            />

            {/* Show alert if booking parameters are incomplete */}
            {!isBookingParametersComplete && (
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertDescription className="flex items-center gap-2 text-orange-800">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className={checkInDate && checkOutDate ? 'text-green-600' : ''}>
                        Dates {checkInDate && checkOutDate ? '✓' : '(Required)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className={guests > 0 ? 'text-green-600' : ''}>
                        Guests {guests > 0 ? '✓' : '(Required)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className={roomTypeFilter !== 'all' ? 'text-green-600' : ''}>
                        Room Type {roomTypeFilter !== 'all' ? '✓' : '(Required)'}
                      </span>
                    </div>
                  </div>
                  <span className="ml-auto">
                    Please complete all fields above to book a room
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <RoomsList
              filteredRooms={filteredRooms}
              loading={loading}
              onBookRoom={onBookRoom}
              showBookingButton={isBookingParametersComplete}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Booking;
