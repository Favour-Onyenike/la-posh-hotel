
-- Create a function to revoke admin status (kick out admins)
CREATE OR REPLACE FUNCTION public.revoke_admin_status(
  target_admin_id UUID,
  revoked_by_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the revoking admin is a primary admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = revoked_by_admin_id AND role = 'primary_admin'
  ) THEN
    RETURN FALSE;
  END IF;

  -- Prevent primary admin from revoking their own status
  IF target_admin_id = revoked_by_admin_id THEN
    RETURN FALSE;
  END IF;

  -- Update the admin's role to 'user'
  UPDATE public.profiles 
  SET role = 'user'
  WHERE id = target_admin_id AND role = 'admin';

  -- Remove all admin permissions for this user
  DELETE FROM public.admin_permissions 
  WHERE admin_id = target_admin_id;

  -- Log the activity
  PERFORM public.log_admin_activity(
    'revoke_admin_status',
    jsonb_build_object('target_admin_id', target_admin_id),
    'profiles',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;

-- Create a function to get all admin users with their details
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  username TEXT,
  role app_role,
  created_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow primary admins to see this data
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'primary_admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Only primary admins can view admin users.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.username,
    p.role,
    p.created_at,
    p.updated_at as last_login
  FROM public.profiles p
  WHERE p.role IN ('admin', 'primary_admin')
  ORDER BY p.created_at DESC;
END;
$$;
