
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import RoomCard from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, Calendar as CalendarIcon, Search, ArrowLeft } from "lucide-react";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const [searchParams, setSearchParams] = useState({
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    accommodationType: "",
    guests: 1,
  });
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const { toast } = useToast();
  const today = new Date();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (searchParams.checkIn && searchParams.checkOut) {
      searchAvailableRooms();
    } else {
      setAvailableRooms(rooms);
    }
  }, [searchParams.checkIn, searchParams.checkOut, rooms]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('availability_status', 'available')
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

  const searchAvailableRooms = async () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_available_rooms', {
        check_in_param: format(searchParams.checkIn, 'yyyy-MM-dd'),
        check_out_param: format(searchParams.checkOut, 'yyyy-MM-dd'),
        room_type_param: searchParams.accommodationType || null
      });

      if (error) {
        throw error;
      }

      // Filter by capacity if needed
      let filtered = data || [];
      if (searchParams.guests > 1) {
        filtered = filtered.filter(room => room.capacity >= searchParams.guests);
      }

      setAvailableRooms(filtered);
    } catch (error) {
      console.error('Error searching available rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to search available rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoomBook = (room: Room) => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      toast({
        title: 'Select Dates',
        description: 'Please select check-in and check-out dates first.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
    // Refresh available rooms
    searchAvailableRooms();
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  // Filter displayed rooms based on search criteria
  const filteredRooms = availableRooms.filter(room => {
    if (searchParams.accommodationType && searchParams.accommodationType !== "all") {
      return room.room_type.toLowerCase() === searchParams.accommodationType.toLowerCase();
    }
    return true;
  });

  const isRoomAvailable = (roomId: string) => {
    return availableRooms.some(room => room.id === roomId);
  };

  if (showBookingForm && selectedRoom && searchParams.checkIn && searchParams.checkOut) {
    return (
      <>
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
          <div className="hotel-container">
            <Button
              variant="outline"
              onClick={handleBookingCancel}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Room Selection
            </Button>
            <BookingForm
              room={selectedRoom}
              checkInDate={searchParams.checkIn}
              checkOutDate={searchParams.checkOut}
              onBookingComplete={handleBookingComplete}
              onCancel={handleBookingCancel}
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
        {/* Hero Section */}
        <section
          className="py-16 md:py-20 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Book Your Stay</h1>
              <p className="text-xl md:text-2xl text-white">
                Reserve your perfect room or suite for an unforgettable experience
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white py-8 shadow-md">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Check-in Date */}
                <div>
                  <label htmlFor="check-in" className="block text-sm font-medium mb-1">Check-in Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.checkIn ? (
                          format(searchParams.checkIn, "PPP")
                        ) : (
                          <span>Select check-in date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={searchParams.checkIn}
                        onSelect={(date) => 
                          setSearchParams({...searchParams, checkIn: date})
                        }
                        disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Check-out Date */}
                <div>
                  <label htmlFor="check-out" className="block text-sm font-medium mb-1">Check-out Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchParams.checkOut ? (
                          format(searchParams.checkOut, "PPP")
                        ) : (
                          <span>Select check-out date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={searchParams.checkOut}
                        onSelect={(date) => 
                          setSearchParams({...searchParams, checkOut: date})
                        }
                        disabled={(date) => 
                          date < today || 
                          (searchParams.checkIn && date <= searchParams.checkIn)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Accommodation Type */}
                <div>
                  <label htmlFor="accommodation-type" className="block text-sm font-medium mb-1">Room Type</label>
                  <Select 
                    value={searchParams.accommodationType} 
                    onValueChange={(value) => 
                      setSearchParams({...searchParams, accommodationType: value})
                    }
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Number of Guests */}
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium mb-1">Guests</label>
                  <Select 
                    value={searchParams.guests.toString()} 
                    onValueChange={(value) => 
                      setSearchParams({...searchParams, guests: parseInt(value)})
                    }
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  variant="hotel"
                  size="lg"
                  className="px-8"
                  onClick={searchAvailableRooms}
                  disabled={!searchParams.checkIn || !searchParams.checkOut}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Availability
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-8">
                {searchParams.checkIn && searchParams.checkOut ? 'Available' : 'All'} Accommodations
              </h2>
              
              {/* Results count and applied filters */}
              <div className="flex flex-wrap items-center justify-between mb-8">
                <p className="text-gray-700 font-medium">
                  Showing {filteredRooms.length} accommodations
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                  {searchParams.accommodationType && searchParams.accommodationType !== "all" && (
                    <Badge variant="outline" className="bg-gray-50">
                      Type: {searchParams.accommodationType}
                    </Badge>
                  )}
                  {searchParams.checkIn && searchParams.checkOut && (
                    <Badge variant="outline" className="bg-gray-50">
                      {format(searchParams.checkIn, "MMM d")} - {format(searchParams.checkOut, "MMM d, yyyy")}
                    </Badge>
                  )}
                  {searchParams.guests > 1 && (
                    <Badge variant="outline" className="bg-gray-50">
                      {searchParams.guests} Guests
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Loading state */}
              {loading && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-700">Searching for available rooms...</p>
                </div>
              )}
              
              {/* Results grid */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard 
                      key={room.id} 
                      room={room}
                      isAvailable={isRoomAvailable(room.id)}
                      onBook={handleRoomBook}
                    />
                  ))}
                </div>
              )}
              
              {!loading && filteredRooms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-700 mb-4">No accommodations found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
                    onClick={() => setSearchParams({
                      checkIn: null,
                      checkOut: null,
                      accommodationType: "",
                      guests: 1,
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Booking Information Section */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="hotel-title text-center mb-8">Booking Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Check-in / Check-out</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Check-in time: 2:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Check-out time: 12:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Early check-in and late check-out available upon request (additional fees may apply)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Policies</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Clock className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>24-hour cancellation policy</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>Maximum capacity as specified per room/suite</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="text-hotel-gold mr-2 mt-1" size={18} />
                      <span>All rates include complimentary breakfast</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Booking;
