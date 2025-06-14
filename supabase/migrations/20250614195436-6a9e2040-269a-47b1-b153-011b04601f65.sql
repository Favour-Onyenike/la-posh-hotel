
-- Create admin activity logs table
CREATE TABLE public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  target_resource TEXT,
  target_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin permissions table to control who can view logs
CREATE TABLE public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) NOT NULL,
  granted_by UUID REFERENCES public.profiles(id) NOT NULL,
  permission_type TEXT NOT NULL, -- 'view_logs', 'manage_admins', etc.
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_id, permission_type)
);

-- Update your account to be primary admin
UPDATE public.profiles 
SET role = 'primary_admin' 
WHERE email = 'onyenikefavour8@gmail.com';

-- Grant yourself permission to view logs (as primary admin you have all permissions by default)
INSERT INTO public.admin_permissions (admin_id, granted_by, permission_type)
SELECT id, id, 'view_logs'
FROM public.profiles 
WHERE email = 'onyenikefavour8@gmail.com';

-- Enable RLS on new tables
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_activity_logs
-- Only primary admins and admins with view_logs permission can see logs
CREATE POLICY "Primary admins can view all activity logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'primary_admin'
  )
);

CREATE POLICY "Admins with view_logs permission can view activity logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE admin_id = auth.uid() 
    AND permission_type = 'view_logs'
  )
);

-- Only authenticated admins can insert logs (for system logging) - fixed to use valid enum values
CREATE POLICY "Admins can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('primary_admin', 'admin')
  )
);

-- RLS policies for admin_permissions
-- Only primary admins can view and manage permissions
CREATE POLICY "Primary admins can view all permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'primary_admin'
  )
);

CREATE POLICY "Primary admins can manage permissions"
ON public.admin_permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'primary_admin'
  )
);

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_text TEXT,
  details_json JSONB DEFAULT NULL,
  target_resource_text TEXT DEFAULT NULL,
  target_id_param UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to check if user has specific admin permission
CREATE OR REPLACE FUNCTION public.has_admin_permission(
  user_id UUID,
  permission TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
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
