
-- Fix the RLS policy for invite_tokens to include primary_admin
DROP POLICY IF EXISTS "Admins can create invite tokens" ON public.invite_tokens;

-- Updated policy to allow both admin and primary_admin roles
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

-- Also update the view policy to include primary_admin
DROP POLICY IF EXISTS "Admins can view invite tokens" ON public.invite_tokens;

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
