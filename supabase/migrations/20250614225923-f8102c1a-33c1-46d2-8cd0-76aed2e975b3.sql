
-- EMERGENCY SECURITY LOCKDOWN - Fixed RLS Policies (No OLD references)

-- Drop ALL existing policies to start clean
DO $$ 
DECLARE
    pol_record RECORD;
BEGIN
    -- Drop all policies from all public tables
    FOR pol_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol_record.policyname, 
                      pol_record.schemaname, 
                      pol_record.tablename);
    END LOOP;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get current user role (prevents recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- SECURE PROFILES TABLE (Critical: Prevent unauthorized access)
CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile data only"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Primary admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'primary_admin');

CREATE POLICY "Primary admins can manage all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = 'primary_admin')
WITH CHECK (public.get_current_user_role() = 'primary_admin');

CREATE POLICY "Primary admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.get_current_user_role() = 'primary_admin');

-- ADMIN ACTIVITY LOGS (Admin access only)
CREATE POLICY "Primary admins can view activity logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'primary_admin');

CREATE POLICY "Admins with log permission can view activity logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (public.has_admin_permission(auth.uid(), 'view_logs'));

CREATE POLICY "System can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('admin', 'primary_admin'));

-- ADMIN PERMISSIONS (Primary admin only)
CREATE POLICY "Primary admins can manage permissions"
ON public.admin_permissions
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'primary_admin')
WITH CHECK (public.get_current_user_role() = 'primary_admin');

-- INVITE TOKENS (Primary admin only)
CREATE POLICY "Primary admins can manage invite tokens"
ON public.invite_tokens
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'primary_admin')
WITH CHECK (public.get_current_user_role() = 'primary_admin');

CREATE POLICY "Allow invite token usage during registration"
ON public.invite_tokens
FOR UPDATE
TO anon, authenticated
USING (NOT is_used AND expires_at > now())
WITH CHECK (NOT is_used AND expires_at > now());

-- BOOKINGS (User owns their data, admins see all)
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'primary_admin'));

CREATE POLICY "Admins can manage all bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'primary_admin'))
WITH CHECK (public.get_current_user_role() IN ('admin', 'primary_admin'));

-- REVIEWS (Public read, user owns their data, admin oversight)
CREATE POLICY "Anyone can view reviews"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can create reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'primary_admin'))
WITH CHECK (public.get_current_user_role() IN ('admin', 'primary_admin'));

-- EVENTS (Public read, admin write)
CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'primary_admin'))
WITH CHECK (public.get_current_user_role() IN ('admin', 'primary_admin'));

-- GALLERY (Public read, admin write)
CREATE POLICY "Anyone can view gallery"
ON public.gallery
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'primary_admin'))
WITH CHECK (public.get_current_user_role() IN ('admin', 'primary_admin'));

-- ROOMS (Public read, admin write)
CREATE POLICY "Anyone can view rooms"
ON public.rooms
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage rooms"
ON public.rooms
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'primary_admin'))
WITH CHECK (public.get_current_user_role() IN ('admin', 'primary_admin'));
