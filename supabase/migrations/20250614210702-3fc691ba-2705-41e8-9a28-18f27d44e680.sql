
-- Enable RLS on reviews table (if not already enabled)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view all reviews (public read access)
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert reviews (public write access for guest reviews)
CREATE POLICY "Anyone can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to update their own reviews (if they have a user_id)
CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own reviews (if they have a user_id)
CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = user_id OR user_id IS NULL);
