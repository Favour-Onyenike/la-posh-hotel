
-- Drop existing policies
DROP POLICY IF EXISTS "Admin can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete event images" ON storage.objects;

-- Create corrected storage policies for the events bucket
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'events' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'events' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'events' AND 
  auth.uid() IS NOT NULL
);
