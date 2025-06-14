
-- Create the events storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events',
  'events',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the events bucket
CREATE POLICY "Public Access for Events Images" ON storage.objects
FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "Admin can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'events' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Admin can update event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'events' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Admin can delete event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'events' AND 
  auth.role() = 'authenticated'
);
