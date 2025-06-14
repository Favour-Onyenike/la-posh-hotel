
-- Fix search_path security issues for all functions by setting them to a secure path

-- Update is_room_available function
CREATE OR REPLACE FUNCTION public.is_room_available(
  room_id_param UUID,
  check_in_param DATE,
  check_out_param DATE,
  exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.bookings 
    WHERE room_id = room_id_param
      AND status NOT IN ('cancelled')
      AND (exclude_booking_id IS NULL OR id != exclude_booking_id)
      AND (
        (check_in_param >= check_in_date AND check_in_param < check_out_date)
        OR (check_out_param > check_in_date AND check_out_param <= check_out_date)
        OR (check_in_param <= check_in_date AND check_out_param >= check_out_date)
      )
  );
END;
$$;

-- Update get_available_rooms function
CREATE OR REPLACE FUNCTION public.get_available_rooms(
  check_in_param DATE,
  check_out_param DATE,
  room_type_param TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price_per_night NUMERIC,
  capacity INTEGER,
  room_type TEXT,
  room_number TEXT,
  image_url TEXT,
  features TEXT[],
  availability_status TEXT
) 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.description, r.price_per_night, r.capacity, 
         r.room_type, r.room_number, r.image_url, r.features, r.availability_status
  FROM public.rooms r
  WHERE r.availability_status = 'available'
    AND (room_type_param IS NULL OR r.room_type = room_type_param)
    AND public.is_room_available(r.id, check_in_param, check_out_param);
END;
$$;

-- Update log_admin_activity function
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_text TEXT,
  details_json JSONB DEFAULT NULL,
  target_resource_text TEXT DEFAULT NULL,
  target_id_param UUID DEFAULT NULL
)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    details,
    target_resource,
    target_id,
    ip_address,
    created_at
  )
  VALUES (
    auth.uid(),
    action_text,
    details_json,
    target_resource_text,
    target_id_param,
    inet_client_addr(),
    now()
  );
END;
$$;

-- Update has_admin_permission function
CREATE OR REPLACE FUNCTION public.has_admin_permission(
  user_id UUID,
  permission TEXT
)
RETURNS BOOLEAN 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
SET search_path = public
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

-- Update grant_log_permission function
CREATE OR REPLACE FUNCTION public.grant_log_permission(
  target_admin_id UUID,
  granted_by_admin_id UUID
)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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
  VALUES (target_admin_id, granted_by_admin_id, 'view_logs')
  ON CONFLICT (admin_id, permission_type) 
  DO UPDATE SET 
    granted_by = EXCLUDED.granted_by,
    granted_at = now();

  -- Log the activity
  PERFORM public.log_admin_activity(
    'grant_log_permission',
    jsonb_build_object('target_admin_id', target_admin_id),
    'admin_permissions',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;

-- Update revoke_log_permission function
CREATE OR REPLACE FUNCTION public.revoke_log_permission(
  target_admin_id UUID,
  revoked_by_admin_id UUID
)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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
  AND permission_type = 'view_logs';

  -- Log the activity
  PERFORM public.log_admin_activity(
    'revoke_log_permission',
    jsonb_build_object('target_admin_id', target_admin_id),
    'admin_permissions',
    target_admin_id
  );

  RETURN TRUE;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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
