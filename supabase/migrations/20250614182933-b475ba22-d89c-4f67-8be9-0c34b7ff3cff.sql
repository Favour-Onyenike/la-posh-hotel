
-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event images" ON storage.objects;

-- Create permissive policies for testing (you can restrict these later when you implement authentication)
CREATE POLICY "Allow public upload to events bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'events');

CREATE POLICY "Allow public update in events bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'events');

CREATE POLICY "Allow public delete from events bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'events');
