
-- Create notifications table to track what each admin has seen
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('booking', 'review', 'activity_log')),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_id, notification_type)
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for admin notifications
CREATE POLICY "Admins can view their own notifications" 
  ON public.admin_notifications 
  FOR SELECT 
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can insert their own notifications" 
  ON public.admin_notifications 
  FOR INSERT 
  WITH CHECK (admin_id = auth.uid());

CREATE POLICY "Admins can update their own notifications" 
  ON public.admin_notifications 
  FOR UPDATE 
  USING (admin_id = auth.uid());

-- Add trigger to update updated_at column
CREATE TRIGGER update_admin_notifications_updated_at
  BEFORE UPDATE ON public.admin_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if admin has new items since last seen
CREATE OR REPLACE FUNCTION public.has_new_items(
  admin_id_param UUID,
  notification_type_param TEXT,
  table_name_param TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_seen TIMESTAMP WITH TIME ZONE;
  latest_item TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get when admin last checked this notification type
  SELECT last_seen_at INTO last_seen
  FROM public.admin_notifications
  WHERE admin_id = admin_id_param AND notification_type = notification_type_param;
  
  -- If no record exists, consider everything as new
  IF last_seen IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check for items newer than last seen based on table
  IF table_name_param = 'bookings' THEN
    SELECT MAX(created_at) INTO latest_item FROM public.bookings;
  ELSIF table_name_param = 'reviews' THEN
    SELECT MAX(created_at) INTO latest_item FROM public.reviews;
  ELSIF table_name_param = 'admin_activity_logs' THEN
    SELECT MAX(created_at) INTO latest_item FROM public.admin_activity_logs;
  END IF;
  
  RETURN latest_item > last_seen;
END;
$$;
