
-- Create functions to grant and revoke team management viewing permissions
CREATE OR REPLACE FUNCTION public.grant_team_permission(
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
  VALUES (target_admin_id, granted_by_admin_id, 'view_team')
  ON CONFLICT (admin_id, permission_type) 
  DO UPDATE SET 
    granted_by = EXCLUDED.granted_by,
    granted_at = now();

  -- Log the activity
  PERFORM public.log_admin_activity(
    'grant_team_permission',
    jsonb_build_object('target_admin_id', target_admin_id),
    'admin_permissions',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_team_permission(
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
  AND permission_type = 'view_team';

  -- Log the activity
  PERFORM public.log_admin_activity(
    'revoke_team_permission',
    jsonb_build_object('target_admin_id', target_admin_id),
    'admin_permissions',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;
