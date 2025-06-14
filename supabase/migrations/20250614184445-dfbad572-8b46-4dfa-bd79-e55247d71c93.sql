
-- Add username column to profiles table
ALTER TABLE public.profiles ADD COLUMN username text UNIQUE;

-- Create invite_tokens table to manage registration links
CREATE TABLE public.invite_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  created_by uuid REFERENCES public.profiles(id) NOT NULL,
  used_by uuid REFERENCES public.profiles(id),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  is_used boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on invite_tokens
ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can create invite tokens
CREATE POLICY "Admins can create invite tokens"
ON public.invite_tokens
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Only admins can view invite tokens
CREATE POLICY "Admins can view invite tokens"
ON public.invite_tokens
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Allow updates for token usage
CREATE POLICY "Allow token usage updates"
ON public.invite_tokens
FOR UPDATE
TO authenticated
USING (NOT is_used AND expires_at > now());

-- Update the handle_new_user function to support username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'username',
    CASE 
      WHEN NEW.email = 'admin@laposh.com' THEN 'admin'::public.app_role 
      WHEN NEW.raw_user_meta_data->>'invite_token' IS NOT NULL THEN 'admin'::public.app_role
      ELSE 'user'::public.app_role 
    END
  );
  
  -- Mark invite token as used if present
  IF NEW.raw_user_meta_data->>'invite_token' IS NOT NULL THEN
    UPDATE public.invite_tokens 
    SET is_used = true, used_by = NEW.id 
    WHERE token = NEW.raw_user_meta_data->>'invite_token' 
      AND NOT is_used 
      AND expires_at > now();
  END IF;
  
  RETURN NEW;
END;
$function$;
