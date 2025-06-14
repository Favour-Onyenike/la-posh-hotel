
-- Update the handle_new_user function to properly set admin role for first admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Check if there are any existing admin profiles
  SELECT COUNT(*) INTO admin_count
  FROM public.profiles
  WHERE role = 'admin';

  INSERT INTO public.profiles (id, email, full_name, username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'username',
    CASE 
      WHEN NEW.email = 'admin@laposh.com' THEN 'admin'::public.app_role 
      WHEN NEW.raw_user_meta_data->>'invite_token' IS NOT NULL THEN 'admin'::public.app_role
      WHEN admin_count = 0 AND NEW.raw_user_meta_data->>'is_first_admin' = 'true' THEN 'admin'::public.app_role
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
$$;
