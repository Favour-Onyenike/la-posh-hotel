
-- First, let's check if the content table already exists and what data it contains
SELECT * FROM public.content WHERE page IN ('about', 'facilities') LIMIT 10;

-- Insert initial content for About page if it doesn't exist
INSERT INTO public.content (page, section, title, content) VALUES
('about', 'hero_title', 'About La Posh', 'About La Posh'),
('about', 'hero_subtitle', 'Hero Subtitle', 'Where luxury meets elegance and sophistication'),
('about', 'story_title', 'Story Title', 'About La Posh'),
('about', 'story_content', 'Story Content', 'Welcome to La Posh Signature Hotel & Suites, where luxury meets elegance and sophistication. Located in the heart of the Abraka Town, our hotel offers an unparalleled hospitality experience, blending modern amenities with timeless charm.

Our story began with a passion for creating unforgettable experiences, and a commitment to excellence in every detail. From our lavish rooms and suites, to our world-class dining and entertainment options, every aspect of our hotel is designed to exceed your expectations.

Whether you''re a discerning business traveler, a romantic couple, or a family on vacation, we invite you to experience the La Posh difference. Let us pamper you with our signature blend of luxury, comfort, and genuine hospitality.'),
('about', 'features_title', 'Features Title', 'What Sets Us Apart'),
('about', 'features_subtitle', 'Features Subtitle', 'Discover the unique elements that define the La Posh experience')
ON CONFLICT (page, section) DO NOTHING;

-- Insert initial content for Facilities page if it doesn't exist
INSERT INTO public.content (page, section, title, content) VALUES
('facilities', 'hero_title', 'Facilities Title', 'Our Facilities'),
('facilities', 'hero_subtitle', 'Facilities Subtitle', 'Luxury amenities for an unforgettable stay'),
('facilities', 'intro_title', 'Introduction Title', 'Premium Amenities'),
('facilities', 'intro_content', 'Introduction Content', 'At La Posh Signature Hotel & Suites, we pride ourselves on offering a comprehensive range of premium facilities designed to enhance your stay. Every amenity has been carefully crafted to exceed your expectations and create memorable experiences.')
ON CONFLICT (page, section) DO NOTHING;

-- Create RLS policies for content table if they don't exist
DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'content' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Create policies for content management
DROP POLICY IF EXISTS "Allow public read access to content" ON public.content;
DROP POLICY IF EXISTS "Allow admins to manage content" ON public.content;

CREATE POLICY "Allow public read access to content"
ON public.content
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admins to manage content"
ON public.content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'primary_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'primary_admin')
  )
);
