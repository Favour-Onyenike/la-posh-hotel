
-- Create the availability check function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_room_available(
  room_id_param UUID,
  check_in_param DATE,
  check_out_param DATE,
  exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.bookings 
    WHERE room_id = room_id_param
      AND status NOT IN ('cancelled')
      AND (exclude_booking_id IS NULL OR id != exclude_booking_id)
      AND (
        (check_in_param >= check_in_date AND check_in_param < check_out_date)
        OR (check_out_param > check_in_date AND check_out_param <= check_out_date)
        OR (check_in_param <= check_in_date AND check_out_param >= check_out_date)
      )
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get available rooms for date range
CREATE OR REPLACE FUNCTION public.get_available_rooms(
  check_in_param DATE,
  check_out_param DATE,
  room_type_param TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price_per_night NUMERIC,
  capacity INTEGER,
  room_type TEXT,
  room_number TEXT,
  image_url TEXT,
  features TEXT[],
  availability_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.description, r.price_per_night, r.capacity, 
         r.room_type, r.room_number, r.image_url, r.features, r.availability_status
  FROM public.rooms r
  WHERE r.availability_status = 'available'
    AND (room_type_param IS NULL OR r.room_type = room_type_param)
    AND public.is_room_available(r.id, check_in_param, check_out_param);
END;
$$ LANGUAGE plpgsql STABLE;

-- Enable RLS on bookings table if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
