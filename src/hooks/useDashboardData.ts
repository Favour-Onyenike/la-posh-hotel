
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking, Room } from '@/types/supabase';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

type BookingsByMonth = {
  month: string;
  count: number;
  revenue: number;
};

type DashboardData = {
  totalRooms: number;
  totalSuites: number;
  availableRooms: number;
  pendingBookings: number;
  confirmedBookings: number;
  revenue: number;
  checkInsToday: number;
  checkOutsToday: number;
  bookingsByMonth: BookingsByMonth[];
  rooms: Room[];
  loading: boolean;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setAvailableRooms: React.Dispatch<React.SetStateAction<number>>;
};

export const useDashboardData = (): DashboardData => {
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [totalSuites, setTotalSuites] = useState<number>(0);
  const [availableRooms, setAvailableRooms] = useState<number>(0);
  const [pendingBookings, setPendingBookings] = useState<number>(0);
  const [confirmedBookings, setConfirmedBookings] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [checkInsToday, setCheckInsToday] = useState<number>(0);
  const [checkOutsToday, setCheckOutsToday] = useState<number>(0);
  const [bookingsByMonth, setBookingsByMonth] = useState<BookingsByMonth[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch rooms data
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*');
        
        if (roomsError) {
          console.error('Error fetching rooms:', roomsError);
          return;
        }
        
        // Transform rooms data to match the expected Room type
        const typedRoomsData = (roomsData || []).map(room => {
          const validStatus = room.availability_status === 'available' ? 'available' : 'taken';
          
          return {
            ...room,
            availability_status: validStatus
          } as Room;
        });
        
        setRooms(typedRoomsData);
        
        // Count rooms and suites
        const standardRooms = typedRoomsData.filter(room => room.room_type === 'room') || [];
        const suites = typedRoomsData.filter(room => room.room_type === 'suite') || [];
        
        setTotalRooms(standardRooms.length);
        setTotalSuites(suites.length);
        
        // Count available rooms
        const availableCount = typedRoomsData.filter(room => room.availability_status === 'available').length || 0;
        setAvailableRooms(availableCount);
        
        // Get today's date
        const today = new Date();
        const todayString = format(today, 'yyyy-MM-dd');
        
        // Fetch pending bookings
        const { data: pendingBookingsData, error: pendingBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('status', 'pending');
        
        if (pendingBookingsError) {
          console.error('Error fetching pending bookings:', pendingBookingsError);
        }
        
        setPendingBookings(pendingBookingsData?.length || 0);
        
        // Fetch confirmed bookings
        const { data: confirmedBookingsData, error: confirmedBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .in('status', ['confirmed', 'checked_in']);
        
        if (confirmedBookingsError) {
          console.error('Error fetching confirmed bookings:', confirmedBookingsError);
        }
        
        setConfirmedBookings(confirmedBookingsData?.length || 0);
        
        // Calculate total revenue from all bookings
        const { data: allBookings, error: allBookingsError } = await supabase
          .from('bookings')
          .select('*');
        
        if (allBookingsError) {
          console.error('Error fetching all bookings:', allBookingsError);
        }
        
        const totalRevenue = (allBookings || []).reduce(
          (sum: number, booking: Booking) => sum + Number(booking.total_price || 0),
          0
        );
        
        setRevenue(totalRevenue);
        
        // Fetch check-ins for today
        const { data: todayCheckIns, error: todayCheckInsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('check_in_date', todayString);
        
        if (todayCheckInsError) {
          console.error('Error fetching today check-ins:', todayCheckInsError);
        }
        
        setCheckInsToday(todayCheckIns?.length || 0);
        
        // Fetch check-outs for today
        const { data: todayCheckOuts, error: todayCheckOutsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('check_out_date', todayString);
        
        if (todayCheckOutsError) {
          console.error('Error fetching today check-outs:', todayCheckOutsError);
        }
        
        setCheckOutsToday(todayCheckOuts?.length || 0);
        
        // Generate monthly booking data for the chart
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const month = subMonths(today, i);
          const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
          const endDate = format(endOfMonth(month), 'yyyy-MM-dd');
          const monthName = format(month, 'MMM');
          
          const { data: monthBookings, error: monthBookingsError } = await supabase
            .from('bookings')
            .select('*')
            .gte('check_in_date', startDate)
            .lte('check_in_date', endDate);
          
          if (monthBookingsError) {
            console.error('Error fetching month bookings:', monthBookingsError);
          }
          
          const monthRevenue = (monthBookings || []).reduce(
            (sum: number, booking: Booking) => sum + Number(booking.total_price || 0),
            0
          );
          
          months.push({
            month: monthName,
            count: monthBookings?.length || 0,
            revenue: monthRevenue
          });
        }
        
        setBookingsByMonth(months);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return {
    totalRooms,
    totalSuites,
    availableRooms,
    pendingBookings,
    confirmedBookings,
    revenue,
    checkInsToday,
    checkOutsToday,
    bookingsByMonth,
    rooms,
    loading,
    setRooms,
    setAvailableRooms
  };
};
