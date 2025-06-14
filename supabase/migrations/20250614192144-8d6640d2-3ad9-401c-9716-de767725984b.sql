
-- Check if RLS is enabled on profiles table and what policies exist
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check existing RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- If there are restrictive policies, let's add a policy that allows users to update their own role
-- This is a temporary policy for testing - in production you'd want more restricted role management
CREATE POLICY "Users can update their own profile including role" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);
