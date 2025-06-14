import { supabase } from '@/integrations/supabase/client';

export const createTestRoom = async () => {
  try {
    const testRoom = {
      name: 'Test Deluxe Suite',
      description: 'A luxurious test suite with ocean view, perfect for testing our booking system. Features include king-size bed, private balcony, and premium amenities.',
      price_per_night: 15000,
      capacity: 2,
      room_type: 'suite',
      room_number: 'TEST-001',
      image_url: '/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png',
      features: ['Ocean View', 'Private Balcony', 'King Size Bed', 'Mini Bar', 'Wi-Fi'],
      availability_status: 'available'
    };

    const { data, error } = await supabase
      .from('rooms')
      .insert(testRoom)
      .select()
      .single();

    if (error) {
      console.error('Error creating test room:', error);
      return null;
    }

    console.log('Test room created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createTestRoom:', error);
    return null;
  }
};

export const createTestBooking = async (roomId: string, customerEmail: string = 'onyenikefavour8@gmail.com') => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

    const testBooking = {
      room_id: roomId,
      check_in_date: tomorrow.toISOString().split('T')[0],
      check_out_date: dayAfterTomorrow.toISOString().split('T')[0],
      guest_name: 'Favour Onyenike',
      guest_email: customerEmail,
      guest_phone: '+234-905-212-9939',
      special_requests: 'Testing the booking confirmation email system. Please ensure all amenities are ready.',
      total_price: 45000, // 3 nights * 15000
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(testBooking)
      .select()
      .single();

    if (error) {
      console.error('Error creating test booking:', error);
      return null;
    }

    console.log('Test booking created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createTestBooking:', error);
    return null;
  }
};

export const confirmBookingAndSendEmail = async (bookingId: string) => {
  try {
    // Update booking status to confirmed
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return null;
    }

    // Get room details
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', booking.room_id)
      .single();

    if (roomError) {
      console.error('Error fetching room details:', roomError);
      return null;
    }

    // Send confirmation email
    const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-booking-confirmation', {
      body: {
        guestName: booking.guest_name,
        guestEmail: booking.guest_email,
        roomName: room.name,
        roomNumber: room.room_number,
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        totalPrice: booking.total_price,
        bookingId: booking.id
      }
    });

    if (emailError) {
      console.error('Error sending confirmation email:', emailError);
      return null;
    }

    console.log('Confirmation email sent successfully:', emailResponse);
    return { booking, room, emailResponse };
  } catch (error) {
    console.error('Error in confirmBookingAndSendEmail:', error);
    return null;
  }
};

export const checkRoomAvailability = async (roomId: string, checkIn: string, checkOut: string) => {
  try {
    const { data, error } = await supabase.rpc('is_room_available', {
      room_id_param: roomId,
      check_in_param: checkIn,
      check_out_param: checkOut
    });

    if (error) {
      console.error('Error checking room availability:', error);
      return false;
    }

    console.log('Room availability check result:', data);
    return data;
  } catch (error) {
    console.error('Error in checkRoomAvailability:', error);
    return false;
  }
};

export const cleanupTestData = async () => {
  try {
    // Delete test bookings first (due to foreign key constraint)
    const { error: bookingError } = await supabase
      .from('bookings')
      .delete()
      .eq('guest_email', 'onyenikefavour8@gmail.com');

    if (bookingError) {
      console.error('Error deleting test bookings:', bookingError);
    }

    // Delete test room
    const { error: roomError } = await supabase
      .from('rooms')
      .delete()
      .eq('room_number', 'TEST-001');

    if (roomError) {
      console.error('Error deleting test room:', roomError);
    }

    console.log('Test data cleanup completed');
  } catch (error) {
    console.error('Error in cleanupTestData:', error);
  }
};

export const runBookingSystemTestWithEmail = async () => {
  console.log('🚀 Starting booking system test with email confirmation...');
  
  // Step 1: Create test room
  console.log('📝 Step 1: Creating test room...');
  const testRoom = await createTestRoom();
  if (!testRoom) {
    console.log('❌ Failed to create test room');
    return;
  }
  
  // Step 2: Create test booking with your email
  console.log('📅 Step 2: Creating test booking with your email...');
  const testBooking = await createTestBooking(testRoom.id, 'onyenikefavour8@gmail.com');
  if (!testBooking) {
    console.log('❌ Failed to create test booking');
    return;
  }
  
  // Step 3: Confirm booking and send email
  console.log('📧 Step 3: Confirming booking and sending email...');
  const result = await confirmBookingAndSendEmail(testBooking.id);
  if (!result) {
    console.log('❌ Failed to confirm booking and send email');
    return;
  }
  
  console.log('✅ Test completed successfully!');
  console.log('📊 Summary:');
  console.log(`- Test Room: ${testRoom.name} (${testRoom.room_number})`);
  console.log(`- Test Booking: ${testBooking.guest_name} - ${testBooking.guest_email}`);
  console.log(`- Check-in: ${testBooking.check_in_date}`);
  console.log(`- Check-out: ${testBooking.check_out_date}`);
  console.log(`- Total: ₦${testBooking.total_price.toLocaleString()}`);
  console.log('📧 Confirmation email sent to: onyenikefavour8@gmail.com');
  console.log('');
  console.log('🎯 Check your email inbox for the confirmation email!');
  console.log('🧹 To cleanup test data, call cleanupTestData()');
  
  return {
    room: testRoom,
    booking: result.booking,
    emailResponse: result.emailResponse
  };
};

export const runBookingSystemTest = async () => {
  console.log('🚀 Starting booking system test...');
  
  // Step 1: Create test room
  console.log('📝 Step 1: Creating test room...');
  const testRoom = await createTestRoom();
  if (!testRoom) {
    console.log('❌ Failed to create test room');
    return;
  }
  
  // Step 2: Check room availability
  console.log('🔍 Step 2: Checking room availability...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
  
  const isAvailable = await checkRoomAvailability(
    testRoom.id,
    tomorrow.toISOString().split('T')[0],
    dayAfterTomorrow.toISOString().split('T')[0]
  );
  
  if (!isAvailable) {
    console.log('❌ Room is not available for booking');
    return;
  }
  
  // Step 3: Create test booking
  console.log('📅 Step 3: Creating test booking...');
  const testBooking = await createTestBooking(testRoom.id);
  if (!testBooking) {
    console.log('❌ Failed to create test booking');
    return;
  }
  
  // Step 4: Verify booking appears in admin
  console.log('✅ Step 4: Test completed successfully!');
  console.log('📊 Summary:');
  console.log(`- Test Room: ${testRoom.name} (${testRoom.room_number})`);
  console.log(`- Test Booking: ${testBooking.guest_name} - ${testBooking.guest_email}`);
  console.log(`- Check-in: ${testBooking.check_in_date}`);
  console.log(`- Check-out: ${testBooking.check_out_date}`);
  console.log(`- Total: ₦${testBooking.total_price.toLocaleString()}`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Go to Admin Dashboard to see the new booking in stats');
  console.log('2. Go to Admin > Bookings to manage the booking');
  console.log('3. Go to Admin > Rooms to see the test room');
  console.log('4. Test booking the room from the public booking page');
  console.log('');
  console.log('🧹 To cleanup test data, call cleanupTestData()');
  
  return {
    room: testRoom,
    booking: testBooking
  };
};
