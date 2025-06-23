
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationCounts {
  bookings: boolean;
  reviews: boolean;
  activity_logs: boolean;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationCounts>({
    bookings: false,
    reviews: false,
    activity_logs: false,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      // Check for new bookings
      const { data: hasNewBookings } = await supabase.rpc('has_new_items', {
        admin_id_param: user.id,
        notification_type_param: 'booking',
        table_name_param: 'bookings'
      });

      // Check for new reviews
      const { data: hasNewReviews } = await supabase.rpc('has_new_items', {
        admin_id_param: user.id,
        notification_type_param: 'review',
        table_name_param: 'reviews'
      });

      // Check for new activity logs
      const { data: hasNewActivityLogs } = await supabase.rpc('has_new_items', {
        admin_id_param: user.id,
        notification_type_param: 'activity_log',
        table_name_param: 'admin_activity_logs'
      });

      setNotifications({
        bookings: hasNewBookings || false,
        reviews: hasNewReviews || false,
        activity_logs: hasNewActivityLogs || false,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationType: string) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('admin_notifications')
        .upsert({
          admin_id: user.id,
          notification_type: notificationType,
          last_seen_at: new Date().toISOString(),
        });

      // Update local state
      setNotifications(prev => ({
        ...prev,
        [notificationType]: false,
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscriptions for new items
    const bookingsChannel = supabase
      .channel('bookings-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bookings'
      }, () => {
        setNotifications(prev => ({ ...prev, bookings: true }));
      })
      .subscribe();

    const reviewsChannel = supabase
      .channel('reviews-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reviews'
      }, () => {
        setNotifications(prev => ({ ...prev, reviews: true }));
      })
      .subscribe();

    const activityLogsChannel = supabase
      .channel('activity-logs-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_activity_logs'
      }, () => {
        setNotifications(prev => ({ ...prev, activity_logs: true }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(activityLogsChannel);
    };
  }, [user?.id]);

  return {
    notifications,
    loading,
    markAsRead,
    refetch: fetchNotifications,
  };
};
