
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Phone, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';

interface BookingFormProps {
  room: {
    id: string;
    name: string;
    room_number: string;
    price_per_night: number;
    room_type: string;
    image_url?: string;
  };
  checkInDate: Date;
  checkOutDate: Date;
  onBookingComplete: () => void;
  onCancel: () => void;
}

const BookingForm = ({ room, checkInDate, checkOutDate, onBookingComplete, onCancel }: BookingFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    special_requests: ''
  });

  const { toast } = useToast();

  // Validate dates and calculate nights more carefully
  const isValidDateRange = checkInDate && checkOutDate && checkInDate < checkOutDate;
  const nights = isValidDateRange ? differenceInDays(checkOutDate, checkInDate) : 0;
  const totalPrice = nights * room.price_per_night;

  // Add debugging logs to trace the price calculation
  console.log('Price calculation debug:', {
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    nights: nights,
    pricePerNight: room.price_per_night,
    totalPrice: totalPrice
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.guest_name.trim() || !formData.guest_email.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.guest_email.trim())) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidDateRange) {
      toast({
        title: 'Invalid Dates',
        description: 'Please select valid check-in and check-out dates.',
        variant: 'destructive',
      });
      return;
    }

    if (nights <= 0) {
      toast({
        title: 'Invalid Duration',
        description: 'Check-out date must be after check-in date.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const checkInDateString = format(checkInDate, 'yyyy-MM-dd');
      const checkOutDateString = format(checkOutDate, 'yyyy-MM-dd');

      console.log('Creating booking with data:', {
        room_id: room.id,
        check_in_date: checkInDateString,
        check_out_date: checkOutDateString,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        total_price: totalPrice,
        nights: nights,
        status: 'pending'
      });

      // Check room availability before booking
      const { data: availabilityCheck, error: availabilityError } = await supabase.rpc('is_room_available', {
        room_id_param: room.id,
        check_in_param: checkInDateString,
        check_out_param: checkOutDateString
      });

      if (availabilityError) {
        console.error('Availability check error:', availabilityError);
        throw new Error('Failed to check room availability');
      }

      if (!availabilityCheck) {
        toast({
          title: 'Room Not Available',
          description: 'This room is no longer available for the selected dates.',
          variant: 'destructive',
        });
        return;
      }

      // Create booking with 'pending' status
      const { data: bookingData, error: bookingError } = await supabase.from('bookings').insert({
        room_id: room.id,
        check_in_date: checkInDateString,
        check_out_date: checkOutDateString,
        guest_name: formData.guest_name.trim(),
        guest_email: formData.guest_email.trim(),
        guest_phone: formData.guest_phone.trim() || null,
        special_requests: formData.special_requests.trim() || null,
        total_price: totalPrice,
        status: 'pending'
      }).select().single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw new Error(`Failed to create booking: ${bookingError.message}`);
      }

      console.log('Booking created successfully:', bookingData);

      toast({
        title: 'Booking Submitted!',
        description: 'Your booking has been submitted and is pending admin approval.',
      });

      onBookingComplete();
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Booking Failed',
        description: `There was an error processing your booking: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidDateRange) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Invalid Booking Dates</h3>
            <p className="text-gray-600 mb-4">Please select valid check-in and check-out dates to continue with your booking.</p>
            <Button onClick={onCancel} variant="outline">
              Back to Room Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {room.image_url && (
              <img 
                src={room.image_url} 
                alt={room.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <p className="text-gray-600">{room.room_number}</p>
              <p className="text-sm text-gray-500 capitalize">{room.room_type}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {format(checkInDate, 'MMM d, yyyy')} - {format(checkOutDate, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span>₦{room.price_per_night.toLocaleString()} × {nights} nights</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg mt-2">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="guest_name">Full Name *</Label>
                <Input
                  id="guest_name"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="guest_email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="guest_email"
                    name="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guest_phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="guest_phone"
                    name="guest_phone"
                    type="tel"
                    value={formData.guest_phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="special_requests">Special Requests</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="special_requests"
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or requirements?"
                    className="pl-10 min-h-[80px]"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hotel"
                  className="flex-1"
                  disabled={loading || !isValidDateRange}
                >
                  {loading ? 'Processing...' : 'Submit Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;
