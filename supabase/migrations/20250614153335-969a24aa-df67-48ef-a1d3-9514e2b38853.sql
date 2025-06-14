
-- Enable RLS on rooms table (if not already enabled)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read rooms (public access)
CREATE POLICY "Anyone can view rooms" 
  ON public.rooms 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert rooms (for testing purposes)
-- In production, you might want to restrict this to authenticated admin users
CREATE POLICY "Anyone can create rooms" 
  ON public.rooms 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to update rooms (for testing purposes)
-- In production, you might want to restrict this to authenticated admin users
CREATE POLICY "Anyone can update rooms" 
  ON public.rooms 
  FOR UPDATE 
  USING (true);

-- Create policy to allow anyone to delete rooms (for testing purposes)
-- In production, you might want to restrict this to authenticated admin users
CREATE POLICY "Anyone can delete rooms" 
  ON public.rooms 
  FOR DELETE 
  USING (true);
