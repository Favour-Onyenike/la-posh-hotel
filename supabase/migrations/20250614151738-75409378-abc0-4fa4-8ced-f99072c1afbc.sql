
-- Enable Row Level Security on the gallery table
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view gallery images (public gallery)
CREATE POLICY "Anyone can view gallery images" 
ON public.gallery 
FOR SELECT 
TO public
USING (true);

-- Create policy to allow anyone to insert gallery images (for admin uploads)
CREATE POLICY "Anyone can insert gallery images" 
ON public.gallery 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policy to allow anyone to update gallery images
CREATE POLICY "Anyone can update gallery images" 
ON public.gallery 
FOR UPDATE 
TO public
USING (true);

-- Create policy to allow anyone to delete gallery images
CREATE POLICY "Anyone can delete gallery images" 
ON public.gallery 
FOR DELETE 
TO public
USING (true);
