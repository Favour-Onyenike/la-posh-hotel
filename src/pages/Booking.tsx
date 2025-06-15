
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

  const onBookRoom = async (room: Room) => {
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

  if (selectedRoom) {
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
              checkInDate={checkInDate ? new Date(checkInDate) : new Date()}
              checkOutDate={checkOutDate ? new Date(checkOutDate) : new Date()}
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

            <RoomsList
              filteredRooms={filteredRooms}
              loading={loading}
              onBookRoom={onBookRoom}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Booking;
