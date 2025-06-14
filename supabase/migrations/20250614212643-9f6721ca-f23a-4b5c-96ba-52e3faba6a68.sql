
-- Create functions to grant and revoke revenue viewing permissions
CREATE OR REPLACE FUNCTION public.grant_revenue_permission(
  target_admin_id UUID,
  granted_by_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the granting admin is a primary admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = granted_by_admin_id AND role = 'primary_admin'
  ) THEN
    RETURN FALSE;
  END IF;

  -- Insert or update the permission
  INSERT INTO public.admin_permissions (admin_id, granted_by, permission_type)
  VALUES (target_admin_id, granted_by_admin_id, 'view_revenue')
  ON CONFLICT (admin_id, permission_type) 
  DO UPDATE SET 
    granted_by = EXCLUDED.granted_by,
    granted_at = now();

  -- Log the activity
  PERFORM public.log_admin_activity(
    'grant_revenue_permission',
    jsonb_build_object('target_admin_id', target_admin_id),
    'admin_permissions',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_revenue_permission(
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

  -- Delete the permission
  DELETE FROM public.admin_permissions 
  WHERE admin_id = target_admin_id 
  AND permission_type = 'view_revenue';

  -- Log the activity
  PERFORM public.log_admin_activity(
    'revoke_revenue_permission',
    jsonb_build_object('target_admin_id', target_admin_id),
    'admin_permissions',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;

-- Update the has_admin_permission function to include revenue permission check
CREATE OR REPLACE FUNCTION public.has_admin_permission(user_id uuid, permission text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    -- Primary admins have all permissions
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'primary_admin'
  ) OR EXISTS (
    -- Or user has specific permission granted
    SELECT 1 FROM public.admin_permissions 
    WHERE admin_id = user_id AND permission_type = permission
  );
$$;
