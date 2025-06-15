
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types/supabase';
import RoomCard from '@/components/RoomCard';
import BookingForm from '@/components/BookingForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Booking = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
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
  }, [rooms, showOnlyAvailable, roomTypeFilter, checkInDate, checkOutDate]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('availability_status', { ascending: false }) // Available first
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

    // Filter by availability
    if (showOnlyAvailable) {
      filtered = filtered.filter(room => room.availability_status === 'available');
    }

    // Filter by room type
    if (roomTypeFilter !== 'all') {
      filtered = filtered.filter(room => room.room_type === roomTypeFilter);
    }

    // Filter by capacity
    filtered = filtered.filter(room => room.capacity >= guests);

    // Sort: Available rooms first, then by price
    filtered.sort((a, b) => {
      // First, sort by availability (available first)
      if (a.availability_status !== b.availability_status) {
        return a.availability_status === 'available' ? -1 : 1;
      }
      // Then by price
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

    setSelectedRoom(room);
  };

  const handleBookingSuccess = () => {
    setSelectedRoom(null);
    fetchRooms(); // Refresh rooms to update availability
    toast({
      title: 'Booking Successful! 🎉',
      description: 'Your booking has been submitted successfully.',
    });
  };

  const handleCancelBooking = () => {
    setSelectedRoom(null);
  };

  const getAvailableCount = () => {
    return rooms.filter(room => room.availability_status === 'available').length;
  };

  const getTotalCount = () => {
    return rooms.length;
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
        {/* Hero Section with Background Image */}
        <section 
          className="py-32 md:py-40 lg:py-48 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/a81671e7-269b-44f3-acfe-e0bf98da4d45.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Book Your Stay</h1>
              <p className="text-xl md:text-2xl text-white">
                Choose from our selection of rooms and suites
              </p>
            </div>
          </div>
        </section>

        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type</label>
                    <select
                      value={roomTypeFilter}
                      onChange={(e) => setRoomTypeFilter(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Types</option>
                      <option value="room">Rooms</option>
                      <option value="suite">Suites</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showOnlyAvailable}
                      onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show only available rooms</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Rooms Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading rooms...</div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">
                      {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
                    </span>
                    {!showOnlyAvailable && (
                      <Badge variant="outline">Including unavailable rooms</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500">
                        <CalendarDays className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No rooms available</h3>
                        <p>Try adjusting your filters or dates</p>
                      </div>
                    </div>
                  ) : (
                    filteredRooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        id={room.id}
                        name={room.name}
                        description={room.description}
                        price={room.price_per_night}
                        capacity={room.capacity}
                        imageUrl={room.image_url || ''}
                        features={room.features || []}
                        onBookNow={() => handleBookRoom(room)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Booking;
