
-- Create storage policies for the gallery bucket (bucket already exists)
CREATE POLICY "Gallery bucket is publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can upload to gallery bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Anyone can update gallery objects" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can delete from gallery bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'gallery');
