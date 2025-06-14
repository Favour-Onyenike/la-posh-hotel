
-- Check current policies on invite_tokens table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'invite_tokens';

-- If the policies still only check for 'admin' role, let's force update them
DROP POLICY IF EXISTS "Admins can create invite tokens" ON public.invite_tokens;
DROP POLICY IF EXISTS "Admins can view invite tokens" ON public.invite_tokens;

-- Create updated policies that include primary_admin
CREATE POLICY "Admins can create invite tokens"
ON public.invite_tokens
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'primary_admin')
  )
);

CREATE POLICY "Admins can view invite tokens"
ON public.invite_tokens
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'primary_admin')
  )
);
