
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Hotel, 
  CalendarDays, 
  DollarSign, 
  Star,
  TrendingUp,
  Users,
  ArrowRightLeft,
  CheckSquare
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { supabase } from '@/integrations/supabase/client';
import { Booking, Room } from '@/types/supabase';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';

type BookingsByMonth = {
  month: string;
  count: number;
  revenue: number;
};

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
};

const StatCard = ({ title, value, description, icon, trend, className }: StatCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 p-1 text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs font-medium">
          <TrendingUp 
            size={14} 
            className={trend >= 0 ? "text-emerald-500" : "text-rose-500"} 
          />
          <span className={trend >= 0 ? "text-emerald-500" : "text-rose-500"}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
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
        
        // Store rooms for availability toggle functionality
        setRooms(roomsData || []);
        
        // Count rooms and suites
        const standardRooms = roomsData?.filter(room => room.room_type === 'room') || [];
        const suites = roomsData?.filter(room => room.room_type === 'suite') || [];
        
        setTotalRooms(standardRooms.length);
        setTotalSuites(suites.length);
        
        // Get today's date
        const today = new Date();
        const todayString = format(today, 'yyyy-MM-dd');
        
        // Fetch active bookings to calculate available rooms
        const { data: activeBookings, error: activeBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .lte('check_in_date', todayString)
          .gte('check_out_date', todayString)
          .in('status', ['confirmed', 'checked_in']);
        
        if (activeBookingsError) {
          console.error('Error fetching active bookings:', activeBookingsError);
        }
        
        // Count available rooms (rooms with availability_status = 'available')
        const availableCount = roomsData?.filter(room => room.availability_status === 'available').length || 0;
        setAvailableRooms(availableCount);
        
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

  // Toggle room availability
  const toggleRoomAvailability = async (roomId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'taken' : 'available';
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ availability_status: newStatus })
        .eq('id', roomId);
        
      if (error) {
        console.error('Error updating room status:', error);
        return;
      }
      
      // Update local state to reflect the change
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, availability_status: newStatus } 
            : room
        )
      );
      
      // Update available rooms count
      const updatedAvailableRooms = rooms
        .map(room => room.id === roomId 
          ? { ...room, availability_status: newStatus } 
          : room
        )
        .filter(room => room.availability_status === 'available')
        .length;
        
      setAvailableRooms(updatedAvailableRooms);
    } catch (error) {
      console.error('Error toggling room availability:', error);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8 mt-4 lg:mt-0">
        <div className="mt-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Admin overview of bookings and hotel statistics.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Rooms" 
            value={totalRooms}
            icon={<Hotel size={20} />}
          />
          <StatCard 
            title="Suites" 
            value={totalSuites}
            icon={<Star size={20} />}
          />
          <StatCard 
            title="Available Accommodations" 
            value={availableRooms}
            description={`${Math.round(((totalRooms + totalSuites) > 0 ? (availableRooms / (totalRooms + totalSuites)) * 100 : 0) || 0)}% occupancy rate`}
            icon={<Hotel size={20} />}
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${revenue.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            trend={12}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Booking Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsByMonth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: any, name: any) => {
                        if (name === 'revenue') {
                          return [`$${Number(value).toLocaleString()}`, 'Revenue'];
                        }
                        return [value, 'Bookings'];
                      }}
                    />
                    <Bar name="count" dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <ArrowRightLeft size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-ins Today</p>
                    <p className="text-2xl font-bold">{checkInsToday}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <CheckSquare size={18} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-outs Today</p>
                    <p className="text-2xl font-bold">{checkOutsToday}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <Users size={18} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Bookings</p>
                    <p className="text-2xl font-bold">{pendingBookings}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <Star size={18} className="text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Confirmed Bookings</p>
                    <p className="text-2xl font-bold">{confirmedBookings}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room & Suite Availability</CardTitle>
            <p className="text-sm text-muted-foreground">Manage room and suite availability status</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rooms.length === 0 ? (
                <p>No rooms or suites found</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-muted-foreground">{room.room_type === 'suite' ? 'Suite' : 'Room'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${room.availability_status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {room.availability_status === 'available' ? 'Available' : 'Reserved'}
                        </span>
                        <Switch 
                          checked={room.availability_status === 'available'}
                          onCheckedChange={() => toggleRoomAvailability(room.id, room.availability_status)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
