
-- Add image_url column to reviews table
ALTER TABLE public.reviews ADD COLUMN image_url text;

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true);

-- Create storage policies for review images
CREATE POLICY "Anyone can view review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "Anyone can update review images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can delete review images"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-images');
