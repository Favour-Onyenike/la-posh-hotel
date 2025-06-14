
-- Enable RLS on events table to fix security issue
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view events (public access)
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
TO public
USING (true);

-- Create policy to allow authenticated users to insert events (for admin)
CREATE POLICY "Authenticated users can create events" 
ON public.events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update events (for admin)
CREATE POLICY "Authenticated users can update events" 
ON public.events 
FOR UPDATE 
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete events (for admin)
CREATE POLICY "Authenticated users can delete events" 
ON public.events 
FOR DELETE 
TO authenticated
USING (true);
